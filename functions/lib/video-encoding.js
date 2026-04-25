"use strict";
/**
 * Video Encoding Service (Backend/Cloud Function)
 * Encodes videos into multiple quality versions
 * Called when video is uploaded to Firebase Storage
 *
 * Usage:
 * This should be deployed as Cloud Function and triggered by:
 * - Cloud Pub/Sub when video is uploaded
 * - Cloud Tasks scheduler
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeUploadedVideo = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const bucket = admin.storage().bucket();
// Quality presets for encoding
const QUALITY_PRESETS = {
    '360p': {
        scale: '640:360',
        bitrate: '500k',
        audioBitrate: '96k',
    },
    '480p': {
        scale: '854:480',
        bitrate: '1000k',
        audioBitrate: '128k',
    },
    '720p': {
        scale: '1280:720',
        bitrate: '2500k',
        audioBitrate: '128k',
    },
};
/**
 * Encode video to specific quality
 * Returns path to encoded video in temp directory
 */
async function encodeVideoToQuality(inputPath, quality, outputDir) {
    return new Promise((resolve, reject) => {
        const preset = QUALITY_PRESETS[quality];
        if (!preset) {
            reject(new Error(`Unknown quality: ${quality}`));
            return;
        }
        const outputPath = path.join(outputDir, `video_${quality}.mp4`);
        ffmpeg(inputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size(preset.scale)
            .videoBitrate(preset.bitrate)
            .audioBitrate(preset.audioBitrate)
            .fps(30)
            .output(outputPath)
            .on('error', (err) => {
            console.error(`[Encoding] Error encoding to ${quality}:`, err);
            reject(err);
        })
            .on('end', () => {
            console.log(`[Encoding] Successfully encoded to ${quality}`);
            resolve(outputPath);
        })
            .on('progress', (progress) => {
            console.log(`[Encoding] ${quality}:`, Math.round(progress.percent), '%');
        })
            .run();
    });
}
/**
 * Upload encoded video to Firebase Storage
 */
async function uploadEncodedVideo(localPath, storagePath, quality, videoId) {
    const dir = path.dirname(storagePath);
    const ext = path.extname(storagePath);
    const basename = path.basename(storagePath, ext);
    const qualityPath = `${dir}/quality-${quality}/${basename}${ext}`;
    await bucket.upload(localPath, {
        destination: qualityPath,
        metadata: {
            metadata: {
                videoId,
                quality,
                originalPath: storagePath,
                encodedAt: new Date().toISOString(),
            },
        },
    });
    console.log('[Upload] Uploaded to Firebase Storage:', qualityPath);
    return qualityPath;
}
/**
 * Update Firestore document with encoded video paths
 */
async function updateFirestoreMetadata(videoId, encodedPaths) {
    const db = admin.firestore();
    await db.collection('videos').doc(videoId).update({
        encodedQualities: encodedPaths,
        encodingStatus: 'completed',
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('[Firestore] Updated video metadata:', videoId);
}
/**
 * Main Cloud Function: Encode video when uploaded
 * Can be triggered manually via HTTP
 */
exports.encodeUploadedVideo = functions.https.onRequest(async (req, res) => {
    try {
        // Get video path from request
        const videoPath = req.query.videoPath || (req.body && req.body.videoPath);
        const videoId = req.query.videoId || (req.body && req.body.videoId);
        if (!videoPath || !videoId) {
            return res.status(400).json({
                error: 'Missing videoPath or videoId. Use ?videoPath=path/to/video.mp4&videoId=id'
            });
        }
        // Only process video files
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv'];
        const isVideo = videoExtensions.some(ext => videoPath.toLowerCase().endsWith(ext));
        if (!isVideo) {
            console.log('[Encoding] Skipping non-video file:', videoPath);
            return res.status(400).json({ error: 'Not a video file' });
        }
        // Skip if already in encoded folder
        if (videoPath.includes('/quality-')) {
            return res.status(400).json({ error: 'Already an encoded version' });
        }
        const tempDir = os.tmpdir();
        const inputFile = path.join(tempDir, `input_${(0, uuid_1.v4)()}`);
        const outputDir = path.join(tempDir, `encoded_${(0, uuid_1.v4)()}`);
        try {
            // Create output directory
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            // Download original video
            console.log('[Encoding] Downloading video:', videoPath);
            await bucket.file(videoPath).download({ destination: inputFile });
            // Encode to multiple qualities
            const encodedPaths = {};
            for (const quality of ['360p', '480p', '720p']) {
                try {
                    console.log(`[Encoding] Starting encoding to ${quality}`);
                    const encodedPath = await encodeVideoToQuality(inputFile, quality, outputDir);
                    const storagePath = await uploadEncodedVideo(encodedPath, videoPath, quality, videoId);
                    encodedPaths[quality] = storagePath;
                    // Clean up temp file
                    fs.unlinkSync(encodedPath);
                }
                catch (error) {
                    console.warn(`[Encoding] Failed to encode to ${quality}:`, error);
                    // Continue with other qualities
                }
            }
            // Update Firestore
            if (Object.keys(encodedPaths).length > 0) {
                await updateFirestoreMetadata(videoId, encodedPaths);
                console.log('[Encoding] Encoding complete for:', videoId);
                return res.json({
                    success: true,
                    videoId,
                    encodedPaths,
                    message: 'Video encoding completed'
                });
            }
            else {
                console.error('[Encoding] Failed to encode any quality for:', videoId);
                return res.status(500).json({
                    error: 'Failed to encode any quality',
                    videoId
                });
            }
        }
        catch (error) {
            console.error('[Encoding] Error processing video:', error);
            return res.status(500).json({
                error: 'Video encoding failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        finally {
            // Cleanup temp files
            try {
                if (fs.existsSync(inputFile))
                    fs.unlinkSync(inputFile);
                if (fs.existsSync(outputDir)) {
                    fs.rmSync(outputDir, { recursive: true, force: true });
                }
            }
            catch (cleanupError) {
                console.warn('[Encoding] Cleanup error:', cleanupError);
            }
        }
    }
    catch (error) {
        console.error('[Encoding] Unexpected error:', error);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});
// End of video-encoding functions
//# sourceMappingURL=video-encoding.js.map