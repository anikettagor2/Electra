"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onTranscoderJobComplete = exports.onRawFootageUploaded = exports.onRevisionCreated = exports.composeRawUpload = exports.onUserCreated = exports.onProjectStatusChanged = exports.onCommentCreated = exports.cleanupProjectAssetsAfterClientDownload = exports.onProjectAssignmentRejected = exports.handleAssignmentTimeout = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const video_transcoder_1 = require("@google-cloud/video-transcoder");
admin.initializeApp();
// Initialize Transcoder API client
const transcoderClient = new video_transcoder_1.TranscoderServiceClient();
// Point fluent-ffmpeg at the bundled binary
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
const AISENSY_URL = "https://backend.aisensy.com/campaign/t1/api/v2";
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}
function extractStoragePathFromUrl(url) {
    var _a;
    if (!url)
        return null;
    if (url.startsWith("gs://")) {
        const noScheme = url.replace("gs://", "");
        const slashIdx = noScheme.indexOf("/");
        return slashIdx >= 0 ? noScheme.slice(slashIdx + 1) : null;
    }
    if (url.includes("/o/")) {
        const encoded = (_a = url.split("/o/")[1]) === null || _a === void 0 ? void 0 : _a.split("?")[0];
        return encoded ? decodeURIComponent(encoded) : null;
    }
    return null;
}
async function deleteStorageObjectByUrl(url) {
    const path = extractStoragePathFromUrl(url);
    if (!path)
        return;
    try {
        await admin.storage().bucket().file(path).delete({ ignoreNotFound: true });
    }
    catch (_a) {
        // Ignore object-level failures to keep cleanup resilient.
    }
}
async function composeManyParts(params) {
    const { bucket, sourcePaths, destinationPath, tempPrefix } = params;
    // GCS compose accepts max 32 source objects per request.
    let currentPaths = [...sourcePaths];
    const tempPaths = [];
    let round = 0;
    while (currentPaths.length > 32) {
        const nextRound = [];
        for (let i = 0; i < currentPaths.length; i += 32) {
            const batch = currentPaths.slice(i, i + 32).map((p) => bucket.file(p));
            const tempPath = `${tempPrefix}/round_${round}_batch_${Math.floor(i / 32)}.tmp`;
            await bucket.file(tempPath).compose(batch);
            nextRound.push(tempPath);
            tempPaths.push(tempPath);
        }
        currentPaths = nextRound;
        round += 1;
    }
    await bucket.file(destinationPath).compose(currentPaths.map((p) => bucket.file(p)));
    // Best-effort cleanup of temporary and part objects.
    await Promise.all([
        ...sourcePaths.map((p) => bucket.file(p).delete().catch(() => undefined)),
        ...tempPaths.map((p) => bucket.file(p).delete().catch(() => undefined)),
    ]);
}
function normalizePhone(phone) {
    if (!phone)
        return null;
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10)
        return `91${digits}`;
    if (digits.length === 12 && digits.startsWith("91"))
        return digits;
    return null;
}
function campaignByRole(role) {
    if (role === "client")
        return "CLIENT";
    if (role === "editor")
        return "EDITOR";
    return "PROJECT_MANAGER";
}
// ---------------------------------------------------------------------------
// Send WhatsApp notification to PM when editor rejects or doesn't accept
// ---------------------------------------------------------------------------
async function sendAssignmentRejectedWhatsApp(params) {
    const apiKey = process.env.AISENSY_API_KEY;
    if (!apiKey) {
        console.warn("[WhatsApp] AISENSY_API_KEY missing; skipping assignment-rejected notification");
        return;
    }
    const settingsSnap = await admin.firestore().collection("settings").doc("whatsapp").get();
    const settings = settingsSnap.exists ? settingsSnap.data() : null;
    if (settings && settings.enabled === false)
        return;
    const campaignName = "pro_delay";
    const payload = {
        apiKey,
        campaignName,
        destination: params.pmPhone,
        userName: params.pmPhone,
        templateParams: [
            params.pmName || "Project Manager", // {{1}} PM Name
            params.projectName || "Unknown Project", // {{2}} Project Name
            params.rejectionReason || "rejected", // {{3}} Rejection reason ("delayed in accepting" or editor reason)
            params.projectName || "Unknown Project", // {{4}} Project name again
        ],
        source: "EditoHub-Functions",
    };
    const response = await fetch(AISENSY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const text = await response.text();
        console.error("[WhatsApp] assignment-rejected send failed:", response.status, text);
    }
    else {
        console.log(`[WhatsApp] PM notified of assignment rejection for project: ${params.projectName}`);
    }
}
async function sendAccountCreatedWhatsApp(params) {
    var _a, _b;
    const apiKey = process.env.AISENSY_API_KEY;
    if (!apiKey) {
        console.warn("[WhatsApp] AISENSY_API_KEY missing; skipping account-created notification");
        return;
    }
    const settingsSnap = await admin.firestore().collection("settings").doc("whatsapp").get();
    const settings = settingsSnap.exists ? settingsSnap.data() : null;
    if (settings && settings.enabled === false)
        return;
    const notif = (_a = settings === null || settings === void 0 ? void 0 : settings.notifications) === null || _a === void 0 ? void 0 : _a.user_account_created;
    if (notif && notif.enabled === false)
        return;
    const message = (notif === null || notif === void 0 ? void 0 : notif.message) ||
        `Your ${params.role.replace(/_/g, " ")} account has been created successfully. You can now log in to EditoHub.`;
    const campaignName = ((_b = settings === null || settings === void 0 ? void 0 : settings.campaigns) === null || _b === void 0 ? void 0 : _b[params.role === "editor" ? "editor" : params.role === "client" ? "client" : "pm"])
        || campaignByRole(params.role);
    const payload = {
        apiKey,
        campaignName,
        destination: params.phone,
        userName: params.phone,
        templateParams: [
            params.name || "User",
            message,
            "EditoHub Account",
        ],
        source: "EditoHub-Functions",
    };
    const response = await fetch(AISENSY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const text = await response.text();
        console.error("[WhatsApp] account-created send failed:", response.status, text);
    }
}
// ---------------------------------------------------------------------------
// Scheduled: Handle assignment timeout (15 minutes) - Auto-reject if not accepted
// ---------------------------------------------------------------------------
exports.handleAssignmentTimeout = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async () => {
    const now = Date.now();
    const fifteenMinutesAgo = now - (15 * 60 * 1000);
    // Find projects with pending assignment that haven't been accepted within 15 minutes
    const pendingSnap = await admin.firestore()
        .collection("projects")
        .where("assignmentStatus", "==", "pending")
        .where("assignedAt", "<=", fifteenMinutesAgo)
        .get();
    for (const projectDoc of pendingSnap.docs) {
        const project = projectDoc.data();
        const editorId = project.assignedEditorId;
        const pmId = project.assignedPMId;
        if (!editorId || !pmId)
            continue;
        // Mark assignment as automatically rejected 
        // This triggers onProjectAssignmentRejected which sends the WhatsApp message.
        await projectDoc.ref.update({
            assignmentStatus: "rejected",
            rejectionReason: "delayed in accepting",
            autoRejectedAt: now,
            updatedAt: now,
        });
        console.log(`[AssignmentTimeout] Project auto-rejected: ${projectDoc.id}, Editor: ${editorId}`);
    }
    return null;
});
// ---------------------------------------------------------------------------
// Trigger: Send pro_delay WhatsApp notification on assignment rejection
// ---------------------------------------------------------------------------
exports.onProjectAssignmentRejected = functions.firestore
    .document("projects/{projectId}")
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    // Check if transition is uniquely to "rejected" state
    if (newData.assignmentStatus === "rejected" && oldData.assignmentStatus !== "rejected") {
        const pmId = newData.assignedPMId;
        if (!pmId)
            return;
        const pmSnap = await admin.firestore().collection("users").doc(pmId).get();
        if (!pmSnap.exists)
            return;
        const pm = pmSnap.data();
        if ((pm === null || pm === void 0 ? void 0 : pm.whatsappNumber) || (pm === null || pm === void 0 ? void 0 : pm.phoneNumber)) {
            const pmPhone = pm.whatsappNumber || pm.phoneNumber;
            const normalizedPhone = normalizePhone(pmPhone);
            if (normalizedPhone) {
                await sendAssignmentRejectedWhatsApp({
                    pmName: pm.displayName || "Project Manager",
                    pmPhone: normalizedPhone,
                    projectName: newData.name || "Unknown Project",
                    rejectionReason: newData.rejectionReason || "rejected",
                });
            }
        }
    }
});
// ---------------------------------------------------------------------------
// Scheduled cleanup: purge project assets 24h after first client download
// ---------------------------------------------------------------------------
exports.cleanupProjectAssetsAfterClientDownload = functions.pubsub
    .schedule("every 60 minutes")
    .onRun(async () => {
    const now = Date.now();
    const dueSnap = await admin.firestore()
        .collection("projects")
        .where("assetsCleanupAfter", "<=", now)
        .get();
    for (const projectDoc of dueSnap.docs) {
        const project = projectDoc.data();
        if (project.assetsPurgedAt)
            continue;
        const rawUrls = (project.rawFiles || []).map((f) => f === null || f === void 0 ? void 0 : f.url).filter(Boolean);
        const referenceUrls = (project.referenceFiles || []).map((f) => f === null || f === void 0 ? void 0 : f.url).filter(Boolean);
        const scriptUrls = (project.scripts || []).map((f) => f === null || f === void 0 ? void 0 : f.url).filter(Boolean);
        const footageUrl = project.footageLink;
        const allUrls = [...rawUrls, ...referenceUrls, ...scriptUrls, footageUrl].filter(Boolean);
        await Promise.all(allUrls.map((url) => deleteStorageObjectByUrl(url)));
        await projectDoc.ref.update({
            rawFiles: [],
            referenceFiles: [],
            scripts: [],
            assetsPurgedAt: now,
            updatedAt: now,
        });
    }
    return null;
});
// ---------------------------------------------------------------------------
// Helper – run an ffmpeg command and return a Promise
// ---------------------------------------------------------------------------
function runFfmpeg(command) {
    return new Promise((resolve, reject) => {
        command.on("end", () => resolve()).on("error", reject).run();
    });
}
// ---------------------------------------------------------------------------
// Helper – download a GCS object to /tmp and return the local path
// ---------------------------------------------------------------------------
async function downloadToTmp(gsPath) {
    // gsPath format: "projects/{id}/revisions/{sid}/{filename}"
    const bucket = admin.storage().bucket();
    const localPath = path.join(os.tmpdir(), path.basename(gsPath));
    await bucket.file(gsPath).download({ destination: localPath });
    return localPath;
}
// ---------------------------------------------------------------------------
// Helper – Create a Transcoder job for 360p MP4 encoding (fast, managed)
// ---------------------------------------------------------------------------
async function createTranscoderJob(inputUri, outputUri, outputFileName) {
    var _a;
    const projectId = process.env.GCLOUD_PROJECT || "studio-4633365007-23d80";
    const location = "us-central1";
    try {
        const parent = transcoderClient.locationPath(projectId, location);
        // Aggressive compression settings for proxy file (400MB → ~30MB)
        const job = {
            inputUri,
            outputUri,
            config: {
                elementaryStreams: [
                    {
                        key: "video_stream",
                        videoStream: {
                            codec: "h264",
                            heightPixels: 240, // Very low resolution (240p)
                            widthPixels: 426, // Maintain aspect ratio
                            bitrateBps: 200000, // 200 kbps video (very low for massive compression)
                            frameRate: 24, // Reduced frame rate
                            preset: "ultrafast", // Fast encoding
                        },
                    },
                    {
                        key: "audio_stream",
                        audioStream: {
                            codec: "aac",
                            bitrateBps: 64000, // 64 kbps audio (also compressed)
                        },
                    },
                ],
                muxStreams: [
                    {
                        key: "mp4",
                        container: "mp4",
                        elementaryStreams: ["video_stream", "audio_stream"],
                        fileName: outputFileName,
                    },
                ],
            },
        };
        console.log('[Transcoder] Creating proxy job for:', inputUri);
        const response = await transcoderClient.createJob({
            parent,
            job: job,
        });
        const jobName = ((_a = response[0]) === null || _a === void 0 ? void 0 : _a.name) || "";
        console.log('[Transcoder] Proxy job created:', jobName);
        return jobName;
    }
    catch (err) {
        console.error('[Transcoder] Proxy job creation failed:', err);
        throw err;
    }
}
// ---------------------------------------------------------------------------
// Trigger: When a new comment is added
// ---------------------------------------------------------------------------
exports.onCommentCreated = functions.firestore
    .document("projects/{projectId}/comments/{commentId}")
    .onCreate(async (snap, context) => {
    const comment = snap.data();
    const projectId = context.params.projectId;
    // 1. Get Project Details
    const projectRef = admin.firestore().collection("projects").doc(projectId);
    const projectSnap = await projectRef.get();
    const project = projectSnap.data();
    if (!project)
        return;
    // 2. Notify Project Members (Email / In-App)
    const members = project.members || [];
    // Filter out the comment author
    const recipients = members.filter((uid) => uid !== comment.userId);
    console.log(`Sending notifications to: ${recipients.join(", ")} for new comment on ${project.name}`);
    // Example: Create notification records in Firestore
    const batch = admin.firestore().batch();
    recipients.forEach((uid) => {
        const notifRef = admin.firestore().collection("users").doc(uid).collection("notifications").doc();
        batch.set(notifRef, {
            type: "comment",
            title: "New Comment",
            message: `${comment.userName} commented on ${project.name}`,
            link: `/dashboard/projects/${projectId}/review/${comment.revisionId}`,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    });
    await batch.commit();
});
// ---------------------------------------------------------------------------
// Trigger: When a project status changes
// ---------------------------------------------------------------------------
exports.onProjectStatusChanged = functions.firestore
    .document("projects/{projectId}")
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();
    if (newData.status !== oldData.status) {
        // Status changed logic (e.g., if Approved, generate final download link)
        console.log(`Project ${context.params.projectId} status changed to ${newData.status}`);
    }
});
// ---------------------------------------------------------------------------
// Trigger: When a new user is created – send account-created WhatsApp
// ---------------------------------------------------------------------------
exports.onUserCreated = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap) => {
    const user = snap.data() || {};
    const role = (user.role || "user");
    const displayName = (user.displayName || "User");
    const normalized = normalizePhone(user.whatsappNumber || user.phoneNumber);
    if (!normalized) {
        console.log("[WhatsApp] No valid phone for new user; skipping", snap.id);
        return;
    }
    await sendAccountCreatedWhatsApp({
        name: displayName,
        role,
        phone: normalized,
    });
});
// ---------------------------------------------------------------------------
// Callable: Compose multipart raw upload into a single file
// ---------------------------------------------------------------------------
exports.composeRawUpload = functions
    .runWith({ timeoutSeconds: 540, memory: "1GB" })
    .https
    .onCall(async (data, context) => {
    var _a, _b;
    if (!((_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required.");
    }
    const uid = context.auth.uid;
    const projectId = String((data === null || data === void 0 ? void 0 : data.projectId) || "");
    const ownerId = String((data === null || data === void 0 ? void 0 : data.ownerId) || "");
    const uploadId = String((data === null || data === void 0 ? void 0 : data.uploadId) || "");
    const fileName = String((data === null || data === void 0 ? void 0 : data.fileName) || "");
    const contentType = String((data === null || data === void 0 ? void 0 : data.contentType) || "application/octet-stream");
    const partsCount = Number((data === null || data === void 0 ? void 0 : data.partsCount) || 0);
    if (!projectId || !ownerId || !uploadId || !fileName || !Number.isInteger(partsCount) || partsCount <= 0) {
        throw new functions.https.HttpsError("invalid-argument", "Invalid compose request payload.");
    }
    if (partsCount > 2000) {
        throw new functions.https.HttpsError("invalid-argument", "Too many upload parts.");
    }
    const projectSnap = await admin.firestore().collection("projects").doc(projectId).get();
    if (!projectSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Project not found.");
    }
    const project = projectSnap.data() || {};
    const userSnap = await admin.firestore().collection("users").doc(uid).get();
    const role = userSnap.exists ? String(((_b = userSnap.data()) === null || _b === void 0 ? void 0 : _b.role) || "") : "";
    const isStaff = ["admin", "manager", "project_manager", "sales_executive"].includes(role);
    const canUpload = isStaff ||
        uid === project.ownerId ||
        uid === project.clientId ||
        uid === project.assignedPMId ||
        uid === project.assignedEditorId;
    if (!canUpload) {
        throw new functions.https.HttpsError("permission-denied", "You do not have access to upload files for this project.");
    }
    const bucket = admin.storage().bucket();
    const sourcePaths = Array.from({ length: partsCount }, (_, index) => (`raw_footage/${ownerId}/multipart/${uploadId}/parts/part_${String(index).padStart(5, "0")}`));
    const safeName = sanitizeFileName(fileName);
    const destinationPath = `raw_footage/${ownerId}/${uploadId}_${safeName}`;
    try {
        await composeManyParts({
            bucket,
            sourcePaths,
            destinationPath,
            tempPrefix: `raw_footage/${ownerId}/multipart/${uploadId}/tmp`,
        });
        await bucket.file(destinationPath).setMetadata({
            contentType,
            metadata: {
                uploadId,
                projectId,
                uploadedBy: uid,
                uploadedAt: String(Date.now()),
            },
        });
        return {
            success: true,
            destinationPath,
        };
    }
    catch (error) {
        console.error("composeRawUpload failed:", error);
        throw new functions.https.HttpsError("internal", (error === null || error === void 0 ? void 0 : error.message) || "Failed to compose uploaded parts.");
    }
});
// ---------------------------------------------------------------------------
// Trigger: When a new revision is created – generate thumbnail + queue HLS
// ---------------------------------------------------------------------------
exports.onRevisionCreated = functions
    .runWith({ timeoutSeconds: 540, memory: "2GB" })
    .firestore
    .document("revisions/{revisionId}")
    .onCreate(async (snap, context) => {
    const revisionId = context.params.revisionId;
    const revision = snap.data();
    if (!(revision === null || revision === void 0 ? void 0 : revision.videoUrl) || !(revision === null || revision === void 0 ? void 0 : revision.projectId))
        return;
    const projectId = revision.projectId;
    const videoUrl = revision.videoUrl;
    // Create the VideoJob tracking document
    const jobRef = admin.firestore().collection("video_jobs").doc(revisionId);
    await jobRef.set({
        id: revisionId,
        projectId,
        revisionId,
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    // ── Extract storage path from download URL ──────────────────────────
    // Firebase Storage download URLs contain the encoded object path after "/o/"
    let gcsPath;
    try {
        const urlObj = new URL(videoUrl);
        // e.g. /v0/b/<bucket>/o/projects%2F...
        const encoded = urlObj.pathname.split("/o/")[1];
        gcsPath = decodeURIComponent(encoded);
    }
    catch (_a) {
        console.error("Could not parse storage URL:", videoUrl);
        await jobRef.update({ status: "error", errorMessage: "Invalid video URL", updatedAt: Date.now() });
        return;
    }
    // ── Step 1: Generate thumbnail ───────────────────────────────────────
    await jobRef.update({ status: "processing_thumbnail", updatedAt: Date.now() });
    let localVideo = null;
    const localThumb = path.join(os.tmpdir(), `${revisionId}_thumb.jpg`);
    try {
        localVideo = await downloadToTmp(gcsPath);
        await runFfmpeg((0, fluent_ffmpeg_1.default)(localVideo)
            .seekInput(5) // seek to 5 seconds
            .frames(1) // capture 1 frame
            .outputOptions("-q:v", "3")
            .output(localThumb));
        const thumbGcsPath = `projects/${projectId}/thumbnails/${revisionId}.jpg`;
        await admin.storage().bucket().upload(localThumb, {
            destination: thumbGcsPath,
            metadata: { contentType: "image/jpeg" },
        });
        const [thumbUrl] = await admin
            .storage()
            .bucket()
            .file(thumbGcsPath)
            .getSignedUrl({ action: "read", expires: "03-01-2500" });
        await Promise.all([
            jobRef.update({ status: "thumbnail_done", thumbnailUrl: thumbUrl, updatedAt: Date.now() }),
            snap.ref.update({ thumbnailUrl: thumbUrl }),
        ]);
        console.log(`Thumbnail generated for revision ${revisionId}`);
    }
    catch (err) {
        console.error("Thumbnail generation failed:", err);
        await jobRef.update({
            status: "error",
            errorMessage: `Thumbnail failed: ${err.message}`,
            updatedAt: Date.now(),
        });
        return;
    }
    finally {
        if (localThumb && fs.existsSync(localThumb))
            fs.unlinkSync(localThumb);
    }
    // ── Step 2: HLS Transcode ────────────────────────────────────────────
    if (!localVideo)
        return;
    await jobRef.update({ status: "transcoding", updatedAt: Date.now() });
    const hlsOutDir = path.join(os.tmpdir(), `hls_${revisionId}`);
    fs.mkdirSync(hlsOutDir, { recursive: true });
    // Define renditions: [label, width, height, videoBitrate]
    const renditions = [
        ["240p", 426, 240, "400k"],
        ["360p", 640, 360, "800k"],
        ["480p", 854, 480, "1200k"],
        ["720p", 1280, 720, "2500k"],
        ["1080p", 1920, 1080, "5000k"],
    ];
    const variantPaths = [];
    try {
        for (const [label, w, h, vbr] of renditions) {
            const renditionDir = path.join(hlsOutDir, label);
            fs.mkdirSync(renditionDir, { recursive: true });
            const m3u8Path = path.join(renditionDir, "index.m3u8");
            await runFfmpeg((0, fluent_ffmpeg_1.default)(localVideo)
                .outputOptions("-vf", `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`, "-c:v", "libx264", "-b:v", vbr, "-c:a", "aac", "-b:a", "128k", "-hls_time", "4", "-hls_list_size", "0", "-hls_segment_filename", path.join(renditionDir, "seg_%03d.ts"), "-f", "hls")
                .output(m3u8Path));
            // Upload all segment files and the playlist
            const segFiles = fs.readdirSync(renditionDir);
            for (const seg of segFiles) {
                const localSeg = path.join(renditionDir, seg);
                const gcsSeg = `projects/${projectId}/hls/${revisionId}/${label}/${seg}`;
                await admin.storage().bucket().upload(localSeg, {
                    destination: gcsSeg,
                    metadata: {
                        contentType: seg.endsWith(".m3u8")
                            ? "application/vnd.apple.mpegurl"
                            : "video/MP2T",
                        cacheControl: "public, max-age=31536000",
                    },
                });
            }
            variantPaths.push(`${label}/index.m3u8`);
        }
        // Build master playlist locally and upload
        // We list the lowest quality first for "Speed First" startup
        const masterContent = [
            "#EXTM3U",
            "#EXT-X-VERSION:3",
            "",
            `#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=426x240`,
            `240p/index.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360`,
            `360p/index.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=1200000,RESOLUTION=854x480`,
            `480p/index.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720`,
            `720p/index.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080`,
            `1080p/index.m3u8`,
        ].join("\n");
        const masterLocalPath = path.join(hlsOutDir, "master.m3u8");
        fs.writeFileSync(masterLocalPath, masterContent);
        const masterGcsPath = `projects/${projectId}/hls/${revisionId}/master.m3u8`;
        await admin.storage().bucket().upload(masterLocalPath, {
            destination: masterGcsPath,
            metadata: { contentType: "application/vnd.apple.mpegurl" },
        });
        const [masterUrl] = await admin
            .storage()
            .bucket()
            .file(masterGcsPath)
            .getSignedUrl({ action: "read", expires: "03-01-2500" });
        await Promise.all([
            jobRef.update({
                status: "ready",
                hlsUrl: masterUrl,
                resolutions: renditions.map(([label]) => label),
                updatedAt: Date.now(),
            }),
            snap.ref.update({ hlsUrl: masterUrl }),
        ]);
        console.log(`HLS transcoding complete for revision ${revisionId}`);
    }
    catch (err) {
        console.error("HLS transcoding failed:", err);
        await jobRef.update({
            status: "error",
            errorMessage: `Transcode failed: ${err.message}`,
            updatedAt: Date.now(),
        });
    }
    finally {
        // Clean up temp files
        if (localVideo && fs.existsSync(localVideo))
            fs.unlinkSync(localVideo);
        fs.rmSync(hlsOutDir, { recursive: true, force: true });
    }
});
__exportStar(require("./mov-to-mp4"), exports);
// ---------------------------------------------------------------------------
// Trigger: When a raw footage file is finished (composed) – generate thumbnail + HLS
// ---------------------------------------------------------------------------
exports.onRawFootageUploaded = functions
    .runWith({ timeoutSeconds: 540, memory: "2GB" })
    .storage
    .object()
    .onFinalize(async (object) => {
    const filePath = object.name;
    if (!filePath || !filePath.startsWith("raw_footage/"))
        return;
    // Skip HLS segments themselves, playlists, and thumbnails to avoid infinite loops
    if (filePath.includes("/hls/") || filePath.includes("/thumbnails/") ||
        filePath.endsWith(".m3u8") || filePath.endsWith(".ts") || filePath.endsWith(".jpg"))
        return;
    const metadata = object.metadata || {};
    const projectId = metadata.projectId;
    const uploadId = metadata.uploadId;
    if (!projectId) {
        console.log("[RawHLS] Skipping raw footage upload with no projectId metadata:", filePath);
        return;
    }
    console.log(`[RawHLS] Starting transcoding for: ${filePath} (Project: ${projectId}, UploadID: ${uploadId})`);
    const bucket = admin.storage().bucket(object.bucket);
    const fileName = path.basename(filePath);
    const localVideo = path.join(os.tmpdir(), fileName);
    const pathParts = filePath.split('/');
    const userId = pathParts[1] || 'unknown';
    const baseVideoId = uploadId || fileName.replace(/\.[^/.]+$/, '');
    const videoId = `${userId}_${baseVideoId}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    const processedBase = `processed_videos/${videoId}`;
    const originalGcsPath = `${processedBase}/original.mp4`;
    const thumbGcsPath = `${processedBase}/thumbnails/thumbnail.jpg`;
    const hlsGcsBase = `${processedBase}/hls`;
    let optimizedVideoUrl;
    try {
        // Download the source video
        await bucket.file(filePath).download({ destination: localVideo });
        // Upload original video to processed_videos path with long CDN cache
        await bucket.upload(localVideo, {
            destination: originalGcsPath,
            metadata: {
                contentType: 'video/mp4',
                cacheControl: 'public, max-age=31536000',
                metadata: {
                    processedFrom: filePath,
                    projectId: projectId || '',
                    userId,
                },
            },
        });
        const [originalUrl] = await bucket.file(originalGcsPath).getSignedUrl({ action: 'read', expires: '03-01-2500' });
        // 1. Generate Thumbnail
        const localThumb = path.join(os.tmpdir(), `raw_${videoId}_thumb.jpg`);
        try {
            await runFfmpeg((0, fluent_ffmpeg_1.default)(localVideo)
                .seekInput(2)
                .frames(1)
                .output(localThumb));
            await bucket.upload(localThumb, {
                destination: thumbGcsPath,
                metadata: {
                    contentType: 'image/jpeg',
                    cacheControl: 'public, max-age=31536000',
                },
            });
        }
        catch (thumbErr) {
            console.error('[RawHLS] Thumbnail generation failed:', thumbErr);
        }
        const [thumbUrl] = await bucket.file(thumbGcsPath).getSignedUrl({ action: 'read', expires: '03-01-2500' });
        if (fs.existsSync(localThumb))
            fs.unlinkSync(localThumb);
        // 2. Generate HLS (2s segments, 360p & 720p only)
        const hlsOutDir = path.join(os.tmpdir(), `hlsraw_${videoId}`);
        if (fs.existsSync(hlsOutDir))
            fs.rmSync(hlsOutDir, { recursive: true, force: true });
        fs.mkdirSync(hlsOutDir, { recursive: true });
        const renditions = [
            ['360p', 640, 360, '800k'],
            ['720p', 1280, 720, '2500k'],
        ];
        for (const [label, w, h, vbr] of renditions) {
            const renditionDir = path.join(hlsOutDir, label);
            fs.mkdirSync(renditionDir, { recursive: true });
            const m3u8Path = path.join(renditionDir, "index.m3u8");
            await runFfmpeg((0, fluent_ffmpeg_1.default)(localVideo)
                .outputOptions("-vf", `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`, "-c:v", "libx264", "-b:v", vbr, "-c:a", "aac", "-b:a", "128k", "-hls_time", "2", "-hls_list_size", "0", "-hls_segment_filename", path.join(renditionDir, "seg_%03d.ts"), "-f", "hls")
                .output(m3u8Path));
            // Upload segments and rendition playlist
            const files = fs.readdirSync(renditionDir);
            for (const f of files) {
                await bucket.upload(path.join(renditionDir, f), {
                    destination: `${hlsGcsBase}/${label}/${f}`,
                    metadata: {
                        contentType: f.endsWith(".m3u8") ? "application/vnd.apple.mpegurl" : "video/MP2T",
                        cacheControl: "public, max-age=31536000"
                    }
                });
            }
        }
        // Build and upload Master Playlist
        const masterContent = [
            "#EXTM3U",
            "#EXT-X-VERSION:3",
            "",
            `#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360`,
            `360p/index.m3u8`,
            `#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720`,
            `720p/index.m3u8`,
        ].join("\n");
        const masterLocal = path.join(hlsOutDir, "master.m3u8");
        fs.writeFileSync(masterLocal, masterContent);
        await bucket.upload(masterLocal, {
            destination: `${hlsGcsBase}/master.m3u8`,
            metadata: { contentType: "application/vnd.apple.mpegurl", cacheControl: "public, max-age=3600" }
        });
        const [masterUrl] = await bucket.file(`${hlsGcsBase}/master.m3u8`).getSignedUrl({ action: "read", expires: "03-01-2500" });
        // 2.5. Generate low-quality proxy MP4 using Transcoder API (aggressive compression: 400MB → ~30MB)
        try {
            console.log('[RawHLS] Submitting proxy transcoding job to Google Transcoder API...');
            // Input is the original raw video
            const inputUri = `gs://${object.bucket}/${filePath}`;
            // Output directory for the proxy video
            const outputUri = `gs://${object.bucket}/${processedBase}/`;
            // Create Transcoder job for proxy (very low quality, small file size)
            const jobName = await createTranscoderJob(inputUri, outputUri, 'proxy.mp4');
            console.log('[RawHLS] Proxy transcoder job submitted:', jobName);
            // Store pending Transcoder job reference
            await admin.firestore().collection("videos").doc(videoId).set({
                transcoderJobName: jobName,
                transcoderJobStatus: "pending",
                transcoderJobSubmittedAt: Date.now(),
            }, { merge: true });
        }
        catch (optErr) {
            console.error('[RawHLS] Proxy transcoder job submission failed:', optErr);
            // Non-critical failure - HLS and original will still work
        }
        // 2.6. Store HLS metadata in Firestore for discovery
        await admin.firestore().collection("videos").doc(videoId).set({
            videoId,
            projectId,
            userId,
            sourceRawPath: filePath,
            processedPath: processedBase,
            originalUrl,
            optimizedUrl: optimizedVideoUrl, // Add optimized URL
            thumbnailUrl: thumbUrl,
            hlsUrl: masterUrl,
            renditions: renditions.map(([label, w, h, vbr]) => ({ label, width: w, height: h, bitrate: vbr })),
            updatedAt: Date.now(),
        }, { merge: true });
        // 3. Update Project in Firestore
        const projectRef = admin.firestore().collection("projects").doc(projectId);
        await admin.firestore().runTransaction(async (transaction) => {
            const projectSnap = await transaction.get(projectRef);
            if (!projectSnap.exists)
                return;
            const data = projectSnap.data();
            const rawFiles = (data === null || data === void 0 ? void 0 : data.rawFiles) || [];
            let updated = false;
            const newRawFiles = rawFiles.map((f) => {
                // Match by uploadId or by checking if the URL contains the filename
                const isMatch = (uploadId && f.id === uploadId) || (f.url && f.url.includes(fileName));
                if (isMatch) {
                    updated = true;
                    return Object.assign(Object.assign({}, f), { hlsUrl: masterUrl, thumbnailUrl: thumbUrl });
                }
                return f;
            });
            if (updated) {
                transaction.update(projectRef, { rawFiles: newRawFiles, updatedAt: Date.now() });
            }
        });
        console.log(`[RawHLS] Finished transcoding for: ${filePath}`);
        // Cleanup temp directory
        fs.rmSync(hlsOutDir, { recursive: true, force: true });
    }
    catch (err) {
        console.error("[RawHLS] Critical Error during processing:", err);
    }
    finally {
        if (fs.existsSync(localVideo))
            fs.unlinkSync(localVideo);
    }
});
// ---------------------------------------------------------------------------
// Trigger: Listen for Transcoder job completion via Pub/Sub
// ---------------------------------------------------------------------------
exports.onTranscoderJobComplete = functions
    .pubsub
    .topic('transcoder-jobs')
    .onPublish(async (message) => {
    try {
        const pubsubMessage = message.json;
        const jobName = (pubsubMessage === null || pubsubMessage === void 0 ? void 0 : pubsubMessage.name) || "";
        const jobState = (pubsubMessage === null || pubsubMessage === void 0 ? void 0 : pubsubMessage.state) || "";
        console.log(`[Transcoder] Job ${jobName} state: ${jobState}`);
        if (jobState !== "SUCCEEDED") {
            if (jobState === "FAILED") {
                console.error(`[Transcoder] Job failed: ${jobName}`);
            }
            return;
        }
        // Query videos collection to find the matching job
        const videosSnap = await admin
            .firestore()
            .collection("videos")
            .where("transcoderJobName", "==", jobName)
            .limit(1)
            .get();
        if (videosSnap.empty) {
            console.log(`[Transcoder] No video found for job ${jobName}`);
            return;
        }
        const videoDoc = videosSnap.docs[0];
        const videoId = videoDoc.id;
        const bucket = admin.storage().bucket();
        // The proxy MP4 file should now exist at: gs://bucket/processed_videos/{videoId}/proxy.mp4
        const proxyMp4Path = `processed_videos/${videoId}/proxy.mp4`;
        // Check if file exists and get signed URL
        try {
            const fileExists = await bucket.file(proxyMp4Path).exists();
            if (!fileExists[0]) {
                console.warn(`[Transcoder] Proxy file not found: ${proxyMp4Path}`);
                // File might still be syncing, retry logic would go here
                return;
            }
            const [proxyUrl] = await bucket
                .file(proxyMp4Path)
                .getSignedUrl({ action: "read", expires: "03-01-2500" });
            // Update video document with the proxy URL
            await videoDoc.ref.update({
                proxyUrl,
                transcoderJobStatus: "completed",
                transcoderJobCompletedAt: Date.now(),
            });
            console.log(`[Transcoder] Updated video ${videoId} with proxy URL`);
        }
        catch (urlErr) {
            console.error(`[Transcoder] Failed to get signed URL for ${proxyMp4Path}:`, urlErr);
        }
    }
    catch (err) {
        console.error("[Transcoder] Pub/Sub handler error:", err);
    }
});
//# sourceMappingURL=index.js.map