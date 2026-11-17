class VideoSplitter {
  constructor() {
    this.videoPath = null;
    this.videoUrl = null;
    this.videoDuration = 0;

    // Elements
    this.player = document.getElementById('splitter-player');
    this.placeholder = document.getElementById('player-placeholder');
    this.timelineTrack = document.getElementById('timeline-track');
    this.timelineProgress = document.getElementById('timeline-progress');
    this.timelineScrubber = document.getElementById('timeline-scrubber');
    this.timelineRange = document.getElementById('timeline-range');
    this.markersLayer = document.getElementById('timeline-markers-layer');
    this.timeCurrentEl = document.getElementById('time-current');
    this.timeTotalEl = document.getElementById('time-total');
    this.fileInfoEl = document.getElementById('video-file-info');
    this.metaBadgeEl = document.getElementById('video-meta-badge');

    // Controls
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.iconPlay = document.getElementById('icon-play');
    this.iconPause = document.getElementById('icon-pause-player');
    this.speedSelect = document.getElementById('playback-speed');

    // Mode A: Markers
    this.cutMarkers = [];
    this.segmentsListEl = document.getElementById('segments-list');
    this.btnExportMarkers = document.getElementById('btn-export-all-markers');

    // Mode B: Trim Range
    this.trimStart = 0;
    this.trimEnd = 0;
    this.trimStartInput = document.getElementById('trim-start-input');
    this.trimEndInput = document.getElementById('trim-end-input');
    this.trimDurationEl = document.getElementById('trim-clip-duration');
    this.btnExportTrim = document.getElementById('btn-export-trim');

    // Mode C: Equal Parts
    this.equalCount = 2;
    this.equalCountEl = document.getElementById('equal-parts-count');
    this.equalHintEl = document.getElementById('equal-parts-hint');
    this.btnExportEqual = document.getElementById('btn-export-equal');

    this.initEvents();
  }

  initEvents() {
    this.player.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.player.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
    this.player.addEventListener('ended', () => this.updatePlayIcon(false));

    this.btnPlayPause.addEventListener('click', () => this.togglePlay());
    document.getElementById('btn-step-back').addEventListener('click', () => {
      this.player.currentTime = Math.max(0, this.player.currentTime - 1);
    });
    document.getElementById('btn-step-forward').addEventListener('click', () => {
      this.player.currentTime = Math.min(this.videoDuration, this.player.currentTime + 1);
    });

    this.speedSelect.addEventListener('change', (e) => {
      this.player.playbackRate = parseFloat(e.target.value);
    });

    // Timeline Scrubbing
    this.timelineTrack.addEventListener('click', (e) => this.seekByClick(e));

    // Mode Switcher Tabs
    document.querySelectorAll('.split-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.split-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.split-subpanel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        const panel = document.getElementById(`split-mode-${mode}`);
        if (panel) panel.classList.add('active');
      });
    });

    // Mode A: Markers events
    document.getElementById('btn-add-marker').addEventListener('click', () => this.addCurrentMarker());
    document.getElementById('btn-clear-markers').addEventListener('click', () => this.clearAllMarkers());
    this.btnExportMarkers.addEventListener('click', () => this.exportAllMarkers());

    // Mode B: Trim events
    document.getElementById('btn-set-start').addEventListener('click', () => {
      this.trimStart = Math.round(this.player.currentTime * 10) / 10;
      if (this.trimEnd <= this.trimStart) {
        this.trimEnd = this.videoDuration;
      }
      this.updateTrimUI();
    });
    document.getElementById('btn-set-end').addEventListener('click', () => {
      this.trimEnd = Math.round(this.player.currentTime * 10) / 10;
      if (this.trimEnd <= this.trimStart) {
        this.trimStart = 0;
      }
      this.updateTrimUI();
    });
    this.btnExportTrim.addEventListener('click', () => this.exportTrimmedClip());

    // Mode C: Equal Parts
    document.getElementById('btn-equal-minus').addEventListener('click', () => {
      if (this.equalCount > 2) {
        this.equalCount--;
        this.updateEqualUI();
      }
    });
    document.getElementById('btn-equal-plus').addEventListener('click', () => {
      if (this.equalCount < 20) {
        this.equalCount++;
        this.updateEqualUI();
      }
    });
    this.btnExportEqual.addEventListener('click', () => this.exportEqualParts());

    // Keyboard Space shortcut for player
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        const splitTab = document.getElementById('tab-split');
        if (splitTab && splitTab.classList.contains('active')) {
          e.preventDefault();
          this.togglePlay();
        }
      }
    });
  }

  // Load a video from path and/or blob URL
  async loadVideo(filePath, blobUrl) {
    this.videoPath = filePath;
    this.videoUrl = blobUrl || `file://${filePath.replace(/\\/g, '/')}`;

    this.player.src = this.videoUrl;
    this.placeholder.style.display = 'none';

    const fileName = filePath ? filePath.split(/[\\/]/).pop() : 'Recorded Video';
    this.fileInfoEl.textContent = fileName;
    this.fileInfoEl.title = filePath || '';

    // Query exact duration via FFmpeg
    try {
      const ffmpegDur = await window.electronAPI.getVideoDuration(filePath);
      if (ffmpegDur && ffmpegDur > 0) {
        this.setDuration(ffmpegDur);
      }
    } catch (e) {
      console.warn('Could not probe duration with FFmpeg:', e);
    }

    this.cutMarkers = [];
    this.renderMarkers();
    this.updateSegmentsList();
  }

  setDuration(dur) {
    this.videoDuration = Math.round(dur * 10) / 10;
    this.timeTotalEl.textContent = this.formatTime(this.videoDuration);
    this.metaBadgeEl.textContent = this.formatTime(this.videoDuration);
    this.metaBadgeEl.style.display = 'inline-block';

    this.trimStart = 0;
    this.trimEnd = this.videoDuration;
    this.updateTrimUI();
    this.updateEqualUI();

    this.btnExportMarkers.disabled = false;
    this.btnExportTrim.disabled = false;
    this.btnExportEqual.disabled = false;
  }

  onLoadedMetadata() {
    const d = this.player.duration;
    if (d && isFinite(d) && d > 0) {
      this.setDuration(d);
    }
  }

  onTimeUpdate() {
    const cur = this.player.currentTime;
    this.timeCurrentEl.textContent = this.formatTime(cur);

    if (this.videoDuration > 0) {
      const pct = Math.min(100, Math.max(0, (cur / this.videoDuration) * 100));
      this.timelineProgress.style.width = `${pct}%`;
      this.timelineScrubber.style.left = `${pct}%`;
    }
  }

  seekByClick(e) {
    if (!this.videoDuration) return;
    const rect = this.timelineTrack.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    this.player.currentTime = ratio * this.videoDuration;
  }

  togglePlay() {
    if (!this.player.src) return;
    if (this.player.paused) {
      this.player.play();
      this.updatePlayIcon(true);
    } else {
      this.player.pause();
      this.updatePlayIcon(false);
    }
  }

  updatePlayIcon(isPlaying) {
    if (isPlaying) {
      this.iconPlay.style.display = 'none';
      this.iconPause.style.display = 'block';
    } else {
      this.iconPlay.style.display = 'block';
      this.iconPause.style.display = 'none';
    }
  }

  // Markers Mode
  addCurrentMarker() {
    if (!this.videoDuration) return;
    const curTime = Math.round(this.player.currentTime * 10) / 10;
    if (curTime <= 0.3 || curTime >= this.videoDuration - 0.3) {
      window.App.showToast('Marker cannot be placed at the very start or end of the video');
      return;
    }

    if (this.cutMarkers.includes(curTime)) return;

    this.cutMarkers.push(curTime);
    this.cutMarkers.sort((a, b) => a - b);

    this.renderMarkers();
    this.updateSegmentsList();
    window.App.showToast(`Split Marker added at ${this.formatTime(curTime)}`);
  }

  clearAllMarkers() {
    this.cutMarkers = [];
    this.renderMarkers();
    this.updateSegmentsList();
  }

  renderMarkers() {
    this.markersLayer.innerHTML = '';
    if (!this.videoDuration) return;

    this.cutMarkers.forEach((sec, idx) => {
      const pct = (sec / this.videoDuration) * 100;
      const pin = document.createElement('div');
      pin.className = 'timeline-marker-pin';
      pin.style.left = `${pct}%`;
      pin.title = `Split ${idx + 1}: ${this.formatTime(sec)} (Click to seek)`;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player.currentTime = sec;
      });
      this.markersLayer.appendChild(pin);
    });
  }

  getSegments() {
    if (!this.videoDuration) return [];
    const points = [0, ...this.cutMarkers, this.videoDuration];
    const segments = [];

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const dur = end - start;
      segments.push({
        name: `Part_${i + 1}`,
        start,
        end,
        duration: dur
      });
    }
    return segments;
  }

  updateSegmentsList() {
    const segments = this.getSegments();
    if (segments.length <= 1) {
      this.segmentsListEl.innerHTML = `
        <div class="empty-segments-msg">
          Play the video, scrub to where you want to split, and click "Add Split Marker".
        </div>
      `;
      return;
    }

    this.segmentsListEl.innerHTML = '';
    segments.forEach((seg, idx) => {
      const item = document.createElement('div');
      item.className = 'segment-item';
      item.innerHTML = `
        <div>
          <span class="segment-title">🎬 Clip ${idx + 1}</span>
          <span class="segment-time" style="margin-left: 10px;">[${this.formatTime(seg.start)} ➔ ${this.formatTime(seg.end)}]</span>
        </div>
        <div style="display:flex; align-items:center; gap: 10px;">
          <span class="badge badge-info">${this.formatTime(seg.duration)}</span>
          <button class="btn btn-ghost btn-sm btn-seek-seg" title="Play this part">▶</button>
        </div>
      `;

      item.querySelector('.btn-seek-seg').addEventListener('click', () => {
        this.player.currentTime = seg.start;
        this.player.play();
        this.updatePlayIcon(true);
      });

      this.segmentsListEl.appendChild(item);
    });
  }

  async exportAllMarkers() {
    if (!this.videoPath) {
      window.App.showToast('Please open or record a video first.');
      return;
    }

    const segments = this.getSegments();
    if (segments.length <= 1) {
      window.App.showToast('Add at least one Split Marker to split the video.');
      return;
    }

    const outputDir = await window.electronAPI.selectOutputDirectory();
    if (!outputDir) return;

    window.App.showProcessing('Splitting Video into Parts...', `Generating ${segments.length} video clips...`);

    try {
      const res = await window.electronAPI.splitVideoMultiple(this.videoPath, segments, outputDir);
      window.App.hideProcessing();
      window.App.showToast(`Successfully exported ${res.count} split clips!`);
      window.electronAPI.showInFolder(outputDir);
    } catch (err) {
      window.App.hideProcessing();
      alert(`Error splitting video: ${err.message}`);
    }
  }

  // Trim Mode UI
  updateTrimUI() {
    this.trimStartInput.value = this.formatTime(this.trimStart);
    this.trimEndInput.value = this.formatTime(this.trimEnd);

    const dur = Math.max(0, this.trimEnd - this.trimStart);
    this.trimDurationEl.textContent = this.formatTime(dur);

    if (this.videoDuration > 0) {
      const startPct = (this.trimStart / this.videoDuration) * 100;
      const endPct = (this.trimEnd / this.videoDuration) * 100;
      this.timelineRange.style.display = 'block';
      this.timelineRange.style.left = `${startPct}%`;
      this.timelineRange.style.width = `${Math.max(0, endPct - startPct)}%`;
    }
  }

  async exportTrimmedClip() {
    if (!this.videoPath) {
      window.App.showToast('Please open or record a video first.');
      return;
    }

    const dur = this.trimEnd - this.trimStart;
    if (dur <= 0.3) {
      window.App.showToast('Trim duration is too short.');
      return;
    }

    const defaultName = `trimmed_${Date.now()}.mp4`;
    const savePath = await window.electronAPI.selectSavePath(defaultName);
    if (!savePath) return;

    window.App.showProcessing('Exporting Trimmed Clip...', 'Extracting video segment...');

    try {
      await window.electronAPI.splitVideoSegment(this.videoPath, this.trimStart, this.trimEnd, savePath);
      window.App.hideProcessing();
      window.App.showToast('Trimmed clip exported successfully!');
      window.electronAPI.showInFolder(savePath);
    } catch (err) {
      window.App.hideProcessing();
      alert(`Error exporting trimmed clip: ${err.message}`);
    }
  }

  // Equal Parts Mode
  updateEqualUI() {
    this.equalCountEl.textContent = this.equalCount;
    if (this.videoDuration > 0) {
      const partDur = this.videoDuration / this.equalCount;
      this.equalHintEl.textContent = `Each clip will be approximately ${this.formatTime(partDur)}`;
    } else {
      this.equalHintEl.textContent = 'Load a video to calculate segment durations.';
    }
  }

  async exportEqualParts() {
    if (!this.videoPath) {
      window.App.showToast('Please open or record a video first.');
      return;
    }

    const outputDir = await window.electronAPI.selectOutputDirectory();
    if (!outputDir) return;

    const partDur = this.videoDuration / this.equalCount;
    const segments = [];
    for (let i = 0; i < this.equalCount; i++) {
      const start = i * partDur;
      const end = (i === this.equalCount - 1) ? this.videoDuration : (i + 1) * partDur;
      segments.push({
        name: `Part_${i + 1}_of_${this.equalCount}`,
        start,
        end,
        duration: end - start
      });
    }

    window.App.showProcessing('Splitting Video...', `Exporting ${this.equalCount} equal parts...`);

    try {
      const res = await window.electronAPI.splitVideoMultiple(this.videoPath, segments, outputDir);
      window.App.hideProcessing();
      window.App.showToast(`Exported ${res.count} equal parts!`);
      window.electronAPI.showInFolder(outputDir);
    } catch (err) {
      window.App.hideProcessing();
      alert(`Error splitting equal parts: ${err.message}`);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00:00';
    const totalSec = Math.floor(seconds);
    const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }
}

window.VideoSplitter = VideoSplitter;
