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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMovUpload = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
const ffprobe_1 = __importDefault(require("@ffprobe-installer/ffprobe"));
// Set up ffmpeg and ffprobe paths
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
fluent_ffmpeg_1.default.setFfprobePath(ffprobe_1.default.path);
exports.processMovUpload = functions
    .runWith({ timeoutSeconds: 540, memory: '2GB' })
    .storage
    .object()
    .onFinalize(async (object) => {
    var _a, _b;
    const filePath = object.name;
    if (!filePath) {
        console.log('No file path present');
        return;
    }
    // 2. Check if the uploaded file is a .mov file.
    if (!filePath.toLowerCase().endsWith('.mov')) {
        console.log(`File is not a .mov: ${filePath}`);
        return;
    }
    // Skip if it's already in the converted folder to prevent loops
    if (filePath.startsWith('converted/')) {
        console.log(`File is already in converted folder: ${filePath}`);
        return;
    }
    const fileNameElement = path.basename(filePath);
    const fileNameWithoutExt = path.parse(fileNameElement).name;
    const bucket = admin.storage().bucket(object.bucket);
    // We assume the videoId is passed in metadata, or we default to the filename.
    const videoId = ((_a = object.metadata) === null || _a === void 0 ? void 0 : _a.videoId) || fileNameWithoutExt;
    const db = admin.firestore();
    const videoDocRef = db.collection('videos').doc(videoId);
    try {
        // 9. Update the database with video status = processing
        await videoDocRef.set({ status: 'processing' }, { merge: true }).catch(err => {
            console.warn(`Failed to update status to processing for ${videoId}:`, err);
        });
        const tempDir = os.tmpdir();
        const localInputPath = path.join(tempDir, `input_${fileNameElement}`);
        const localOutputPath = path.join(tempDir, `${fileNameWithoutExt}.mp4`);
        console.log(`Downloading ${filePath} to ${localInputPath}`);
        await bucket.file(filePath).download({ destination: localInputPath });
        // 4. Before converting, check the video codec using ffprobe.
        console.log(`Probing codec for ${localInputPath}`);
        const probeData = await new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default.ffprobe(localInputPath, (err, metadata) => {
                if (err)
                    reject(err);
                else
                    resolve(metadata);
            });
        });
        const videoStream = (_b = probeData.streams) === null || _b === void 0 ? void 0 : _b.find((s) => s.codec_type === 'video');
        const isH264 = (videoStream === null || videoStream === void 0 ? void 0 : videoStream.codec_name) === 'h264';
        console.log(`Video codec is: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.codec_name}. isH264: ${isH264}`);
        console.log(`Starting FFmpeg processing for ${localInputPath}`);
        await new Promise((resolve, reject) => {
            let command = (0, fluent_ffmpeg_1.default)(localInputPath);
            if (isH264) {
                // 5. If the codec is already H.264, do a fast remux instead of full conversion
                command = command
                    .videoCodec('copy')
                    .outputOptions(['-movflags +faststart']);
            }
            else {
                // 6. If the codec is not H.264, convert using specified settings
                command = command
                    .videoCodec('libx264')
                    .outputOptions([
                    '-preset veryfast',
                    '-crf 20',
                    '-threads 0',
                    '-movflags +faststart'
                ])
                    .audioCodec('aac');
            }
            command
                .output(localOutputPath)
                .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
            })
                .on('end', () => {
                console.log('FFmpeg processing finished');
                resolve();
            })
                .run();
        });
        // 7. Upload the converted MP4 back to Google Cloud Storage in a converted/ folder.
        const destinationPath = `converted/${fileNameWithoutExt}.mp4`;
        console.log(`Uploading converted file to ${destinationPath}`);
        await bucket.upload(localOutputPath, {
            destination: destinationPath,
            metadata: {
                contentType: 'video/mp4',
                metadata: {
                    originalName: filePath,
                    videoId: videoId
                }
            }
        });
        // Keep original MOV file as backup (we just don't delete it from storage)
        // 8. Keep the original MOV file as backup.
        // Get signed URL or just store the path
        const [signedUrl] = await bucket.file(destinationPath).getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Far future
        });
        console.log(`Updating database for videoId: ${videoId} with status: ready`);
        // 9. Update the database with video status = ready
        await videoDocRef.set({
            status: 'ready',
            videoUrl: signedUrl,
            storagePath: destinationPath,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        // Clean up local temp files
        fs.unlinkSync(localInputPath);
        fs.unlinkSync(localOutputPath);
        console.log(`Process completed successfully for ${filePath}`);
    }
    catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        await videoDocRef.set({
            status: 'error',
            errorMessage: error.message || 'Unknown error',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
});
//# sourceMappingURL=mov-to-mp4.js.map