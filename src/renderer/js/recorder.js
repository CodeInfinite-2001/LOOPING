class ScreenRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordingState = 'idle'; // idle | recording | paused
    this.timerInterval = null;
    this.elapsedSeconds = 0;

    // Selected options
    this.mode = 'fullscreen'; // 'fullscreen' | 'area'
    this.selectedSourceId = null;
    this.selectedArea = null; // { x, y, width, height, viewportWidth, viewportHeight }
    this.audioMode = 'mic'; // 'none' | 'mic' | 'system' | 'both'
    this.selectedMicId = 'default';
    this.fps = 30;
    this.quality = 'high';

    // Canvas crop resources
    this.cropCanvas = null;
    this.cropCtx = null;
    this.hiddenVideo = null;
    this.cropAnimationId = null;

    // Audio stream & context
    this.audioCtx = null;
    this.micStream = null;
    this.vuAnimationId = null;

    // Event callbacks
    this.onStateChange = null;
    this.onTimerUpdate = null;
    this.onRecordingComplete = null;
  }

  async getSources() {
    try {
      return await window.electronAPI.getSources();
    } catch (err) {
      console.error('Error fetching sources:', err);
      return [];
    }
  }

  async getMicrophones() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(d => d.kind === 'audioinput');
    } catch (err) {
      console.error('Error fetching audio devices:', err);
      return [];
    }
  }

  // Live microphone VU meter
  async startMicLevelMonitor(deviceId, onLevel) {
    this.stopMicLevelMonitor();
    try {
      const constraints = {
        audio: deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : true,
        video: false
      };
      this.micStream = await navigator.mediaDevices.getUserMedia(constraints);
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(this.micStream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const levelPercent = Math.min(100, Math.round((avg / 128) * 100));
        if (onLevel) onLevel(levelPercent);
        this.vuAnimationId = requestAnimationFrame(update);
      };
      update();
    } catch (err) {
      console.warn('Could not start mic level monitor:', err);
    }
  }

  stopMicLevelMonitor() {
    if (this.vuAnimationId) {
      cancelAnimationFrame(this.vuAnimationId);
      this.vuAnimationId = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
  }

  // Start Screen Recording
  async startRecording(options = {}) {
    if (this.recordingState !== 'idle') return;

    this.mode = options.mode || this.mode;
    this.selectedSourceId = options.sourceId || this.selectedSourceId;
    this.selectedArea = options.area || this.selectedArea;
    this.audioMode = options.audioMode || this.audioMode;
    this.selectedMicId = options.micId || this.selectedMicId;
    this.fps = parseInt(options.fps || this.fps, 10);
    this.quality = options.quality || this.quality;

    this.stopMicLevelMonitor(); // Stop VU meter stream so mic is available

    this.recordedChunks = [];
    this.elapsedSeconds = 0;

    // 1. Capture base Desktop Screen Video Stream
    let desktopConstraints = {
      audio: (this.audioMode === 'system' || this.audioMode === 'both') ? {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      } : false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: this.selectedSourceId,
          minFrameRate: this.fps,
          maxFrameRate: this.fps
        }
      }
    };

    let videoBitrate = 5000000; // 5 Mbps
    if (this.quality === 'high') videoBitrate = 9000000;
    else if (this.quality === 'standard') videoBitrate = 2500000;

    let rawStream;
    try {
      rawStream = await navigator.mediaDevices.getUserMedia(desktopConstraints);
    } catch (streamErr) {
      if (desktopConstraints.audio) {
        console.warn('System loopback audio failed, retrying video only:', streamErr);
        desktopConstraints.audio = false;
        rawStream = await navigator.mediaDevices.getUserMedia(desktopConstraints);
      } else {
        throw streamErr;
      }
    }

    let finalVideoTrack = null;

    // 2. Handle Area Cropping or Full Screen
    if (this.mode === 'area' && this.selectedArea) {
      finalVideoTrack = await this.setupAreaCrop(rawStream, this.selectedArea, this.fps);
      window.electronAPI.showRecordingBorder(this.selectedArea);
    } else {
      finalVideoTrack = rawStream.getVideoTracks()[0];
    }

    // 3. Audio Mixing Pipeline
    let systemTrack = rawStream.getAudioTracks()[0] || null;
    let micTrack = null;

    if (this.audioMode === 'mic' || this.audioMode === 'both') {
      try {
        const micConstraints = {
          audio: this.selectedMicId && this.selectedMicId !== 'default'
            ? { deviceId: { exact: this.selectedMicId }, echoCancellation: true, noiseSuppression: true }
            : { echoCancellation: true, noiseSuppression: true },
          video: false
        };
        const micStream = await navigator.mediaDevices.getUserMedia(micConstraints);
        micTrack = micStream.getAudioTracks()[0];
      } catch (err) {
        console.warn('Could not capture microphone:', err);
      }
    }

    let finalAudioTrack = null;
    if (this.audioMode === 'both' && systemTrack && micTrack) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const dest = this.audioCtx.createMediaStreamDestination();

      const sysSource = this.audioCtx.createMediaStreamSource(new MediaStream([systemTrack]));
      const micSource = this.audioCtx.createMediaStreamSource(new MediaStream([micTrack]));

      sysSource.connect(dest);
      micSource.connect(dest);
      finalAudioTrack = dest.stream.getAudioTracks()[0];
    } else if (this.audioMode === 'system' && systemTrack) {
      finalAudioTrack = systemTrack;
    } else if ((this.audioMode === 'mic' || this.audioMode === 'both') && micTrack) {
      finalAudioTrack = micTrack;
    }

    // 4. Combine tracks into stream
    const combinedTracks = [finalVideoTrack];
    if (finalAudioTrack) {
      combinedTracks.push(finalAudioTrack);
    }
    const finalStream = new MediaStream(combinedTracks);

    // 5. Select Best Supported MimeType
    let mimeType = 'video/webm; codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm; codecs=vp8,opus';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    this.mediaRecorder = new MediaRecorder(finalStream, {
      mimeType,
      videoBitsPerSecond: videoBitrate,
      audioBitsPerSecond: 192000
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      this.cleanupRecording();
      await this.processRecordedVideo(mimeType);
    };

    this.mediaRecorder.start(1000);
    this.recordingState = 'recording';
    this.startTimer();

    if (this.onStateChange) this.onStateChange(this.recordingState);
  }

  // Setup Area Crop using DOM-attached video & high-performance Canvas
  async setupAreaCrop(sourceStream, area, fps) {
    const rawTrack = sourceStream.getVideoTracks()[0];
    const settings = rawTrack.getSettings ? rawTrack.getSettings() : {};

    // Create and attach video element to DOM so Chromium decodes smoothly
    this.hiddenVideo = document.createElement('video');
    this.hiddenVideo.srcObject = sourceStream;
    this.hiddenVideo.muted = true;
    this.hiddenVideo.autoplay = true;
    this.hiddenVideo.playsInline = true;
    this.hiddenVideo.style.position = 'fixed';
    this.hiddenVideo.style.top = '-9999px';
    this.hiddenVideo.style.left = '-9999px';
    this.hiddenVideo.style.width = '1px';
    this.hiddenVideo.style.height = '1px';
    this.hiddenVideo.style.opacity = '0';
    this.hiddenVideo.style.pointerEvents = 'none';
    document.body.appendChild(this.hiddenVideo);

    await new Promise((resolve) => {
      this.hiddenVideo.onloadedmetadata = () => {
        this.hiddenVideo.play().then(resolve).catch(resolve);
      };
      setTimeout(resolve, 800);
    });

    // Calculate exact pixel dimensions
    const actualWidth = this.hiddenVideo.videoWidth || settings.width || 1920;
    const actualHeight = this.hiddenVideo.videoHeight || settings.height || 1080;

    const vpW = area.viewportWidth || window.innerWidth || actualWidth;
    const vpH = area.viewportHeight || window.innerHeight || actualHeight;

    const scaleX = actualWidth / vpW;
    const scaleY = actualHeight / vpH;

    const cropX = Math.max(0, Math.round(area.x * scaleX));
    const cropY = Math.max(0, Math.round(area.y * scaleY));
    const cropW = Math.min(actualWidth - cropX, Math.round(area.width * scaleX));
    const cropH = Math.min(actualHeight - cropY, Math.round(area.height * scaleY));

    this.cropCanvas = document.createElement('canvas');
    this.cropCanvas.width = Math.max(16, cropW);
    this.cropCanvas.height = Math.max(16, cropH);
    this.cropCtx = this.cropCanvas.getContext('2d', { alpha: false });

    const drawFrame = () => {
      if (this.recordingState === 'idle') return;
      if (this.hiddenVideo && this.hiddenVideo.readyState >= 2) {
        this.cropCtx.drawImage(
          this.hiddenVideo,
          cropX, cropY, cropW, cropH,
          0, 0, this.cropCanvas.width, this.cropCanvas.height
        );
      }
      this.cropAnimationId = requestAnimationFrame(drawFrame);
    };

    this.cropAnimationId = requestAnimationFrame(drawFrame);
    const canvasStream = this.cropCanvas.captureStream(fps);
    return canvasStream.getVideoTracks()[0];
  }

  pauseRecording() {
    if (this.recordingState === 'recording' && this.mediaRecorder) {
      this.mediaRecorder.pause();
      this.recordingState = 'paused';
      if (this.onStateChange) this.onStateChange(this.recordingState);
      window.electronAPI.updateMiniBarPause(true);
    }
  }

  resumeRecording() {
    if (this.recordingState === 'paused' && this.mediaRecorder) {
      this.mediaRecorder.resume();
      this.recordingState = 'recording';
      if (this.onStateChange) this.onStateChange(this.recordingState);
      window.electronAPI.updateMiniBarPause(false);
    }
  }

  togglePause() {
    if (this.recordingState === 'recording') this.pauseRecording();
    else if (this.recordingState === 'paused') this.resumeRecording();
  }

  stopRecording() {
    if (this.recordingState !== 'idle' && this.mediaRecorder) {
      this.stopTimer();
      window.electronAPI.hideRecordingBorder();
      window.electronAPI.hideMiniBar();
      this.mediaRecorder.stop();
      this.recordingState = 'idle';
      if (this.onStateChange) this.onStateChange(this.recordingState);
    }
  }

  cleanupRecording() {
    if (this.cropAnimationId) {
      cancelAnimationFrame(this.cropAnimationId);
      this.cropAnimationId = null;
    }
    if (this.hiddenVideo) {
      if (this.hiddenVideo.srcObject) {
        this.hiddenVideo.srcObject.getTracks().forEach(t => t.stop());
      }
      if (this.hiddenVideo.parentNode) {
        this.hiddenVideo.parentNode.removeChild(this.hiddenVideo);
      }
      this.hiddenVideo = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.recordingState === 'recording') {
        this.elapsedSeconds++;
        const timeStr = this.formatTime(this.elapsedSeconds);
        if (this.onTimerUpdate) this.onTimerUpdate(timeStr, this.elapsedSeconds);
        window.electronAPI.updateMiniBarTimer(timeStr);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(totalSec) {
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  async processRecordedVideo(mimeType) {
    const blob = new Blob(this.recordedChunks, { type: mimeType });
    const arrayBuffer = await blob.arrayBuffer();

    // Finalize recording with FFmpeg into clean, seekable MP4 with duration
    const tempResult = await window.electronAPI.saveTempVideo(arrayBuffer);
    const finalPath = tempResult.filePath;
    const finalUrl = `file://${finalPath.replace(/\\/g, '/')}`;

    if (this.onRecordingComplete) {
      this.onRecordingComplete({
        blob,
        videoUrl: finalUrl,
        tempFilePath: finalPath,
        durationSeconds: this.elapsedSeconds,
        durationStr: this.formatTime(this.elapsedSeconds),
        sizeBytes: blob.size
      });
    }
  }
}

window.ScreenRecorder = ScreenRecorder;
