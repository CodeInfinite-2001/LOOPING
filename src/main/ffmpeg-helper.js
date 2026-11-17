const path = require('path');
const fs = require('fs');
const { spawn, execFile } = require('child_process');

function getFfmpegPath() {
  try {
    let ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic) {
      if (ffmpegStatic.includes('app.asar')) {
        const unpackedPath = ffmpegStatic.replace('app.asar', 'app.asar.unpacked');
        if (fs.existsSync(unpackedPath)) {
          return unpackedPath;
        }
      }
      if (fs.existsSync(ffmpegStatic)) {
        return ffmpegStatic;
      }
    }
  } catch (err) {
    console.warn('ffmpeg-static require failed:', err);
  }

  const platform = process.platform;
  const isWin = platform === 'win32';
  const binaryName = isWin ? 'ffmpeg.exe' : 'ffmpeg';

  const localNm = path.join(__dirname, '..', '..', 'node_modules', 'ffmpeg-static', binaryName);
  if (fs.existsSync(localNm)) {
    return localNm;
  }

  return binaryName;
}

const ffmpegBinary = getFfmpegPath();
console.log('Using FFmpeg at:', ffmpegBinary);

/**
 * Format seconds to HH:MM:SS.mmm
 */
function formatTime(totalSec) {
  const s = Math.max(0, Number(totalSec) || 0);
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = Math.floor(s % 60);
  const ms = Math.floor((s - Math.floor(s)) * 1000);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/**
 * Finalize raw MediaRecorder WebM into standard indexed MP4 with duration
 */
function finalizeRecording(inputWebmPath, outputMp4Path) {
  return new Promise((resolve, reject) => {
    // Attempt fast remux or transcode to MP4
    const args = [
      '-y',
      '-i', inputWebmPath,
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-crf', '22',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outputMp4Path
    ];

    const child = spawn(ffmpegBinary, args);
    let stderr = '';

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputMp4Path)) {
        resolve({ success: true, outputPath: outputMp4Path });
      } else {
        // Fallback: copy to WebM with cues if MP4 transcode failed
        console.warn('MP4 transcode failed, trying WebM remux:', stderr);
        const webmArgs = ['-y', '-i', inputWebmPath, '-c', 'copy', outputMp4Path];
        const webmChild = spawn(ffmpegBinary, webmArgs);
        webmChild.on('close', (wCode) => {
          if (wCode === 0) resolve({ success: true, outputPath: outputMp4Path });
          else reject(new Error(`Failed to finalize recording: ${stderr}`));
        });
      }
    });

    child.on('error', reject);
  });
}

/**
 * Convert or remux recorded video to target MP4 path
 */
function convertToMp4(inputPath, outputPath, onProgress) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const args = [
      '-y',
      '-i', inputPath,
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-movflags', '+faststart',
      outputPath
    ];

    const child = spawn(ffmpegBinary, args);
    let stderr = '';

    child.stderr.on('data', (data) => {
      stderr += data.toString();
      if (onProgress) onProgress(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({ success: true, outputPath });
      } else {
        // Transcode fallback
        const transcodeArgs = [
          '-y',
          '-i', inputPath,
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '22',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          outputPath
        ];

        const transcodeChild = spawn(ffmpegBinary, transcodeArgs);
        let tErr = '';
        transcodeChild.stderr.on('data', (d) => { tErr += d.toString(); });
        transcodeChild.on('close', (tCode) => {
          if (tCode === 0 && fs.existsSync(outputPath)) {
            resolve({ success: true, outputPath });
          } else {
            reject(new Error(`FFmpeg export failed: ${tErr || stderr}`));
          }
        });
      }
    });

    child.on('error', reject);
  });
}

/**
 * Split video segment cleanly
 */
function splitVideoSegment(inputPath, startTimeSec, endTimeSec, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const durationSec = Math.max(0.2, endTimeSec - startTimeSec);
    const startNum = Math.max(0, startTimeSec);

    // Try fast stream copy first
    const copyArgs = [
      '-y',
      '-ss', String(startNum),
      '-i', inputPath,
      '-t', String(durationSec),
      '-c', 'copy',
      '-avoid_negative_ts', 'make_zero',
      outputPath
    ];

    const child = spawn(ffmpegBinary, copyArgs);
    let stderr = '';

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      const stats = fs.existsSync(outputPath) ? fs.statSync(outputPath) : null;
      if (code === 0 && stats && stats.size > 1000) {
        resolve({ success: true, outputPath });
      } else {
        // Fallback: frame-accurate ultrafast transcode
        console.warn('Fast copy produced empty or failed split, using ultrafast re-encode:', stderr);
        const recodeArgs = [
          '-y',
          '-ss', String(startNum),
          '-i', inputPath,
          '-t', String(durationSec),
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '22',
          '-c:a', 'aac',
          outputPath
        ];

        const recodeChild = spawn(ffmpegBinary, recodeArgs);
        let recodeErr = '';
        recodeChild.stderr.on('data', (d) => { recodeErr += d.toString(); });
        recodeChild.on('close', (rcCode) => {
          if (rcCode === 0 && fs.existsSync(outputPath)) {
            resolve({ success: true, outputPath });
          } else {
            reject(new Error(`Failed to split video: ${recodeErr || stderr}`));
          }
        });
      }
    });

    child.on('error', reject);
  });
}

/**
 * Get video duration in seconds using ffmpeg
 */
function getVideoDuration(inputPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(inputPath)) {
      return resolve(null);
    }

    const args = ['-i', inputPath];
    execFile(ffmpegBinary, args, (err, stdout, stderr) => {
      const output = stderr || '';
      const match = output.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2,3})/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const fraction = parseFloat('0.' + match[4]);
        const total = hours * 3600 + minutes * 60 + seconds + fraction;
        resolve(total);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  getFfmpegPath,
  finalizeRecording,
  convertToMp4,
  splitVideoSegment,
  getVideoDuration
};
