// Internationalization dictionary
const i18nData = {
  en: {
    sub: 'Screen Recorder & Video Splitter',
    tabRec: 'Record',
    tabSplit: 'Split Video',
    tabSettings: 'Settings',
    modeTitle: 'Select Recording Mode',
    modeDesc: 'Choose between Full Screen or a Selected Area',
    modeFs: 'Full Screen',
    modeFsSub: 'Record entire display',
    modeArea: 'Select Area',
    modeAreaSub: 'Record specific screen region',
    lblDisplay: 'Display Source:',
    btnPickArea: 'Select Region on Screen',
    noArea: 'No area selected (Defaults to 1280×720)',
    areaSelected: 'Selected Region: ',
    audioTitle: 'Audio Settings',
    audioDesc: 'Choose sound source or record silently',
    audNone: 'No Sound',
    audNoneSub: 'Video only',
    audMic: 'Microphone',
    audMicSub: 'Record your voice',
    audSys: 'System Audio',
    audSysSub: 'Computer / video sound',
    audBoth: 'Mic + System',
    audBothSub: 'Mix voice & PC audio',
    lblMicDev: 'Microphone Device:',
    prefTitle: 'Recording Preferences',
    prefDesc: 'FPS, quality, and window behavior',
    lblFps: 'Frame Rate (FPS):',
    lblQuality: 'Video Quality:',
    chkMin: 'Minimize to Mini Floating Bar during recording',
    chkCount: 'Show 3-second countdown before recording',
    btnStart: 'START RECORDING',
    recStatusTitle: 'RECORDING IN PROGRESS',
    btnLoadVid: 'Open Video File',
    playerEmpty: 'Load or record a video to start trimming & splitting',
    tabMarkers: '✂️ Cut Markers (Multi-Split)',
    tabRange: '⏱️ Trim Range (Start & End)',
    tabEqual: '📊 Split Equal Parts',
    btnAddCut: 'Add Split Marker at Current Time',
    btnClearCuts: 'Clear All Markers',
    segHeader: 'Output Clips Preview:',
    noCutsMsg: 'Play the video, scrub to where you want to cut, and click "Add Split Marker".',
    btnExportAll: 'Export All Split Clips',
    lblStart: 'Start Time:',
    lblEnd: 'End Time:',
    lblClipDur: 'Clip Duration:',
    btnSetStart: 'Set Current [ [ ',
    btnSetEnd: 'Set Current ] ] ',
    btnExportClip: 'Export Trimmed Clip',
    lblEqualParts: 'Split video into:',
    lblEqualClips: 'equal clips',
    btnExportEqual: 'Split and Export Parts',
    setApp: 'Application Information',
    setShortcuts: 'Keyboard Shortcuts',
    keyF9: 'Start / Stop Screen Recording (Global)',
    keyF10: 'Pause / Resume Recording (Global)',
    keySpace: 'Play / Pause Video in Splitter',
    keyEnter: 'Confirm Custom Area Selection',
    keyEsc: 'Cancel Custom Area Selection',
    setExport: 'Default Export Format',
    lblDefFormat: 'Format:',
    modalPrompt: 'What would you like to do with this recording?',
    modalBtnSave: 'Save Recording (MP4)',
    modalBtnSplit: 'Open in Video Splitter'
  },
  si: {
    sub: 'LOOPING - ස්ක්‍රීන් රෙකෝඩර් සහ වීඩියෝ ස්ප්ලිටර් මෘදුකාංගය',
    tabRec: 'පටිගත කිරීම',
    tabSplit: 'වීඩියෝ කපන්න (Split)',
    tabSettings: 'සැකසුම්',
    modeTitle: 'පටිගත කිරීමේ ආකාරය තෝරන්න',
    modeDesc: 'සම්පූර්ණ තිරය (Full Screen) හෝ තිරයේ කැමති කොටසක් තෝරන්න',
    modeFs: 'සම්පූර්ණ තිරය',
    modeFsSub: 'මුළු තිරයම පටිගත කරන්න',
    modeArea: 'කොටසක් තෝරන්න',
    modeAreaSub: 'තිරයේ අවශ්‍ය කොටස පමණක් රෙකෝඩ් කරන්න',
    lblDisplay: 'ප්‍රධාන මොනිටරය:',
    btnPickArea: 'තිරයේ කොටස තෝරන්න (Select Area)',
    noArea: 'කොටසක් තෝරා නැත (1280×720 පෙරනිමියෙන්)',
    areaSelected: 'තෝරාගත් ප්‍රමාණය: ',
    audioTitle: 'ශබ්ද සැකසුම් (Audio Settings)',
    audioDesc: 'ශබ්දය සහිතව හෝ රහිතව පටිගත කරන්න',
    audNone: 'ශබ්ද රහිතව',
    audNoneSub: 'වීඩියෝව පමණි (No Audio)',
    audMic: 'මයික්‍රෆෝනය',
    audMicSub: 'ඔබේ හඬ පමණක් (Mic Only)',
    audSys: 'පරිගණක ශබ්දය',
    audSysSub: 'පරිගණකයේ සද්දය (System Audio)',
    audBoth: 'දෙකම එකට',
    audBothSub: 'හඬ සහ පරිගණක ශබ්දය දෙකම',
    lblMicDev: 'මයික්‍රෆෝනය තෝරන්න:',
    prefTitle: 'වීඩියෝ ගුණාත්මකභාවය',
    prefDesc: 'FPS, Video Quality සහ පහසුකම්',
    lblFps: 'වේගය (FPS):',
    lblQuality: 'වීඩියෝ ගුණාත්මකභාවය:',
    chkMin: 'රෙකෝඩ් වන විට ප්‍රධාන කවුළුව කුඩා කර Mini Bar පෙන්වන්න',
    chkCount: 'ආරම්භ කිරීමට පෙර තත්පර 3 ක Countdown පෙන්වන්න',
    btnStart: 'පටිගත කිරීම අරඹන්න',
    recStatusTitle: 'දැනට පටිගත වෙමින් පවතී',
    btnLoadVid: 'වීඩියෝවක් තෝරන්න (Open Video)',
    playerEmpty: 'කැපීමට හෝ කොටස් වලට වෙන් කිරීමට වීඩියෝවක් ඇතුළත් කරන්න',
    tabMarkers: '✂️ කැපීම් ලකුණු (Multi-Split)',
    tabRange: '⏱️ කොටසක් කපන්න (Trim Start & End)',
    tabEqual: '📊 සමාන කොටස් වලට බෙදන්න (Equal Split)',
    btnAddCut: 'වත්මන් ස්ථානයෙන් කැපීම් ලකුණක් යොදන්න',
    btnClearCuts: 'සියලු ලකුණු ඉවත් කරන්න',
    segHeader: 'නිර්මාණය වන වීඩියෝ කොටස්:',
    noCutsMsg: 'වීඩියෝව වාදනය කර කැපීමට අවශ්‍ය තැනදී "Add Split Marker" ඔබන්න.',
    btnExportAll: 'සියලුම කොටස් වෙන් කර බාගන්න (Export All)',
    lblStart: 'ආරම්භක වෙලාව:',
    lblEnd: 'අවසාන වෙලාව:',
    lblClipDur: 'වීඩියෝ කොටසේ දිග:',
    btnSetStart: 'මෙතැනින් අරඹන්න [ [ ',
    btnSetEnd: 'මෙතැනින් අවසන් කරන්න ] ] ',
    btnExportClip: 'මෙම කොටස කපා සේව් කරන්න',
    lblEqualParts: 'වීඩියෝව සමාන කොටස්:',
    lblEqualClips: 'කට බෙදන්න',
    btnExportEqual: 'සමාන කොටස් වලට වෙන් කරන්න',
    setApp: 'මෘදුකාංග විස්තරය',
    setShortcuts: 'යතුරුපුවරු කෙටිමං (Shortcuts)',
    keyF9: 'පටිගත කිරීම ආරම්භය / අවසානය (F9)',
    keyF10: 'තාවකාලිකව නැවතීම / නැවත ඇරඹීම (F10)',
    keySpace: 'වීඩියෝව Play / Pause කිරීම (Space)',
    keyEnter: 'තෝරාගත් කොටස තහවුරු කිරීම (Enter)',
    keyEsc: 'කොටස තේරීම අවලංගු කිරීම (Esc)',
    setExport: 'පෙරනිමි ආකෘතිය (Format)',
    lblDefFormat: 'Format:',
    modalPrompt: 'පටිගත කළ වීඩියෝව සඳහා ඔබ කිරීමට කැමති කුමක්ද?',
    modalBtnSave: 'වීඩියෝව සේව් කරන්න (MP4)',
    modalBtnSplit: 'වීඩියෝව කපන්න (Open in Splitter)'
  }
};

class AppController {
  constructor() {
    this.currentLang = 'en';
    this.recorder = new ScreenRecorder();
    this.splitter = new VideoSplitter();

    this.selectedArea = null;
    this.lastRecording = null; // { tempFilePath, blob, videoUrl, ... }

    this.initDOM();
    this.bindEvents();
    this.loadSourcesAndMics();
  }

  initDOM() {
    // Mode cards
    this.modeCards = document.querySelectorAll('.mode-card');
    this.fsContainer = document.getElementById('fs-source-container');
    this.areaContainer = document.getElementById('area-source-container');
    this.btnPickArea = document.getElementById('btn-select-area');
    this.areaBadge = document.getElementById('area-badge');

    // Controls
    this.sourceSelect = document.getElementById('screen-source-select');
    this.micSelect = document.getElementById('mic-select');
    this.vuBar = document.getElementById('vu-bar');
    this.fpsSelect = document.getElementById('fps-select');
    this.qualitySelect = document.getElementById('quality-select');
    this.chkMinimize = document.getElementById('chk-minimize');
    this.chkCountdown = document.getElementById('chk-countdown');

    // Action buttons
    this.btnStartRecord = document.getElementById('btn-start-record');
    this.activeRecBanner = document.getElementById('active-rec-banner');
    this.recTimerEl = document.getElementById('rec-timer');
    this.btnBannerPause = document.getElementById('btn-banner-pause');
    this.bannerPauseText = document.getElementById('banner-pause-text');
    this.btnBannerStop = document.getElementById('btn-banner-stop');

    // Modals
    this.postRecordModal = document.getElementById('post-record-modal');
    this.modalPreviewVideo = document.getElementById('modal-preview-video');
    this.modalDurationBadge = document.getElementById('modal-duration-badge');
    this.modalSizeBadge = document.getElementById('modal-size-badge');
    this.btnModalSave = document.getElementById('btn-modal-save');
    this.btnModalSplit = document.getElementById('btn-modal-split');
    this.btnCloseModal = document.getElementById('btn-close-modal');

    // Processing modal & toast
    this.processingModal = document.getElementById('processing-modal');
    this.processingTitle = document.getElementById('processing-title');
    this.processingStatus = document.getElementById('processing-status');
    this.toastEl = document.getElementById('toast');
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownNumber = document.getElementById('countdown-number');
  }

  bindEvents() {
    // Nav Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.dataset.tab;
        const targetPane = document.getElementById(tabId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Language Toggle
    document.getElementById('lang-en').addEventListener('click', () => this.setLanguage('en'));
    document.getElementById('lang-si').addEventListener('click', () => this.setLanguage('si'));

    // Mode Selection (Fullscreen vs Area)
    this.modeCards.forEach(card => {
      card.addEventListener('click', () => {
        this.modeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const mode = card.dataset.mode;
        if (mode === 'fullscreen') {
          this.fsContainer.style.display = 'block';
          this.areaContainer.style.display = 'none';
        } else {
          this.fsContainer.style.display = 'none';
          this.areaContainer.style.display = 'block';
        }
      });
    });

    // Area Selection
    this.btnPickArea.addEventListener('click', async () => {
      await window.electronAPI.openAreaSelector();
    });

    window.electronAPI.onAreaSelected((rect) => {
      this.selectedArea = rect;
      const dict = i18nData[this.currentLang];
      this.areaBadge.textContent = `${dict.areaSelected}${rect.width} × ${rect.height} px (x: ${rect.x}, y: ${rect.y})`;
      this.areaBadge.classList.replace('badge-info', 'badge-success');
      this.showToast(`Region selected: ${rect.width} × ${rect.height}`);
    });

    // Audio Radio selection & Mic change
    document.querySelectorAll('input[name="audio-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = e.target.value;
        const micRow = document.getElementById('mic-settings-row');
        if (val === 'mic' || val === 'both') {
          micRow.style.display = 'flex';
          this.recorder.startMicLevelMonitor(this.micSelect.value, (lvl) => {
            this.vuBar.style.width = `${lvl}%`;
          });
        } else {
          micRow.style.display = 'none';
          this.recorder.stopMicLevelMonitor();
          this.vuBar.style.width = '0%';
        }
      });
    });

    this.micSelect.addEventListener('change', () => {
      this.recorder.startMicLevelMonitor(this.micSelect.value, (lvl) => {
        this.vuBar.style.width = `${lvl}%`;
      });
    });

    // Recording Start / Stop Actions
    this.btnStartRecord.addEventListener('click', () => this.handleStartRecording());
    this.btnBannerPause.addEventListener('click', () => this.recorder.togglePause());
    this.btnBannerStop.addEventListener('click', () => this.recorder.stopRecording());

    // Shortcuts from main process
    window.electronAPI.onShortcutAction((action) => {
      if (action === 'toggle-record') {
        if (this.recorder.recordingState === 'idle') {
          this.handleStartRecording();
        } else {
          this.recorder.stopRecording();
        }
      } else if (action === 'toggle-pause') {
        this.recorder.togglePause();
      } else if (action === 'stop-recording') {
        this.recorder.stopRecording();
      }
    });

    // Recorder Callbacks
    this.recorder.onStateChange = (state) => {
      if (state === 'recording') {
        this.activeRecBanner.style.display = 'flex';
        this.btnStartRecord.style.display = 'none';
        this.bannerPauseText.textContent = '⏸ Pause (F10)';
      } else if (state === 'paused') {
        this.bannerPauseText.textContent = '▶ Resume (F10)';
      } else if (state === 'idle') {
        this.activeRecBanner.style.display = 'none';
        this.btnStartRecord.style.display = 'flex';
        this.recTimerEl.textContent = '00:00:00';
      }
    };

    this.recorder.onTimerUpdate = (timeStr) => {
      this.recTimerEl.textContent = timeStr;
    };

    this.recorder.onRecordingComplete = (recData) => {
      this.lastRecording = recData;
      this.showPostRecordModal(recData);
    };

    // Post-Recording Modal Handlers
    this.btnCloseModal.addEventListener('click', () => {
      this.postRecordModal.style.display = 'none';
      this.modalPreviewVideo.pause();
    });

    this.btnModalSave.addEventListener('click', () => this.handleSaveModalRecording());
    this.btnModalSplit.addEventListener('click', () => this.handleOpenModalInSplitter());

    // Load External Video into Splitter
    document.getElementById('btn-load-video').addEventListener('click', async () => {
      const filePath = await window.electronAPI.selectOpenVideo();
      if (filePath) {
        this.splitter.loadVideo(filePath);
        this.showToast('Video loaded into Splitter');
      }
    });
  }

  async loadSourcesAndMics() {
    // 1. Screens
    const sources = await this.recorder.getSources();
    this.sourceSelect.innerHTML = '';
    sources.forEach(src => {
      const opt = document.createElement('option');
      opt.value = src.id;
      opt.textContent = src.name;
      this.sourceSelect.appendChild(opt);
    });

    // 2. Microphones
    const mics = await this.recorder.getMicrophones();
    this.micSelect.innerHTML = '';
    if (mics.length === 0) {
      const opt = document.createElement('option');
      opt.value = 'default';
      opt.textContent = 'Default Microphone';
      this.micSelect.appendChild(opt);
    } else {
      mics.forEach((mic, i) => {
        const opt = document.createElement('option');
        opt.value = mic.deviceId;
        opt.textContent = mic.label || `Microphone ${i + 1}`;
        this.micSelect.appendChild(opt);
      });
    }

    // Start VU monitor if mic is checked
    this.recorder.startMicLevelMonitor(this.micSelect.value, (lvl) => {
      this.vuBar.style.width = `${lvl}%`;
    });
  }

  async handleStartRecording() {
    const activeModeCard = document.querySelector('.mode-card.active');
    const mode = activeModeCard ? activeModeCard.dataset.mode : 'fullscreen';

    if (mode === 'area' && !this.selectedArea) {
      // Prompt user to select area or use default
      this.showToast('Please select a region first with "Select Region on Screen"');
      await window.electronAPI.openAreaSelector();
      return;
    }

    const audioMode = document.querySelector('input[name="audio-mode"]:checked').value;
    const sourceId = this.sourceSelect.value;
    const micId = this.micSelect.value;
    const fps = parseInt(this.fpsSelect.value, 10);
    const quality = this.qualitySelect.value;

    const shouldMinimize = this.chkMinimize.checked;
    const shouldCountdown = this.chkCountdown.checked;

    const startExecution = async () => {
      if (shouldMinimize) {
        window.electronAPI.showMiniBar();
      }

      await this.recorder.startRecording({
        mode,
        sourceId,
        area: this.selectedArea,
        audioMode,
        micId,
        fps,
        quality
      });
    };

    if (shouldCountdown) {
      this.runCountdown(3, startExecution);
    } else {
      await startExecution();
    }
  }

  runCountdown(seconds, onFinish) {
    this.countdownOverlay.style.display = 'flex';
    let current = seconds;
    this.countdownNumber.textContent = current;

    const interval = setInterval(() => {
      current--;
      if (current > 0) {
        this.countdownNumber.textContent = current;
      } else {
        clearInterval(interval);
        this.countdownOverlay.style.display = 'none';
        onFinish();
      }
    }, 1000);
  }

  showPostRecordModal(recData) {
    this.modalPreviewVideo.src = recData.videoUrl;
    this.modalDurationBadge.textContent = `Duration: ${recData.durationStr}`;
    const sizeMb = (recData.sizeBytes / (1024 * 1024)).toFixed(1);
    this.modalSizeBadge.textContent = `Size: ${sizeMb} MB`;
    this.postRecordModal.style.display = 'flex';
  }

  async handleSaveModalRecording() {
    if (!this.lastRecording) return;
    const defaultFormat = document.getElementById('default-format-select').value;
    const defaultName = `Recording_${Date.now()}.${defaultFormat}`;
    const targetPath = await window.electronAPI.selectSavePath(defaultName);
    if (!targetPath) return;

    this.showProcessing('Saving Recording...', 'Finalizing video file...');

    try {
      const isMp4 = targetPath.toLowerCase().endsWith('.mp4');
      if (isMp4) {
        // Remux or transcode to clean MP4 with FFmpeg
        await window.electronAPI.convertToMp4(this.lastRecording.tempFilePath, targetPath);
      } else {
        // Direct save buffer
        const arrayBuf = await this.lastRecording.blob.arrayBuffer();
        await window.electronAPI.saveVideoBuffer(arrayBuf, targetPath);
      }

      this.hideProcessing();
      this.postRecordModal.style.display = 'none';
      this.showToast('Recording saved successfully!');
      window.electronAPI.showInFolder(targetPath);
    } catch (err) {
      this.hideProcessing();
      alert(`Error saving recording: ${err.message}`);
    }
  }

  handleOpenModalInSplitter() {
    if (!this.lastRecording) return;
    this.postRecordModal.style.display = 'none';
    this.modalPreviewVideo.pause();

    // Switch to Splitter tab
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    const splitBtn = document.querySelector('[data-tab="tab-split"]');
    if (splitBtn) splitBtn.classList.add('active');
    document.getElementById('tab-split').classList.add('active');

    // Load recorded clip
    this.splitter.loadVideo(this.lastRecording.tempFilePath, this.lastRecording.videoUrl);
    this.showToast('Recording loaded into Splitter! You can now trim or cut it.');
  }

  setLanguage(lang) {
    this.currentLang = lang;
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-si').classList.toggle('active', lang === 'si');

    const dict = i18nData[lang];
    if (!dict) return;

    // Apply translations
    document.getElementById('i18n-sub').textContent = dict.sub;
    document.getElementById('i18n-tab-rec').textContent = dict.tabRec;
    document.getElementById('i18n-tab-split').textContent = dict.tabSplit;
    document.getElementById('i18n-tab-settings').textContent = dict.tabSettings;

    document.getElementById('i18n-mode-title').textContent = dict.modeTitle;
    document.getElementById('i18n-mode-desc').textContent = dict.modeDesc;
    document.getElementById('i18n-mode-fs').textContent = dict.modeFs;
    document.getElementById('i18n-mode-fs-sub').textContent = dict.modeFsSub;
    document.getElementById('i18n-mode-area').textContent = dict.modeArea;
    document.getElementById('i18n-mode-area-sub').textContent = dict.modeAreaSub;

    document.getElementById('i18n-lbl-display').textContent = dict.lblDisplay;
    document.getElementById('i18n-btn-pick-area').textContent = dict.btnPickArea;
    if (!this.selectedArea) {
      this.areaBadge.textContent = dict.noArea;
    } else {
      this.areaBadge.textContent = `${dict.areaSelected}${this.selectedArea.width} × ${this.selectedArea.height} px`;
    }

    document.getElementById('i18n-audio-title').textContent = dict.audioTitle;
    document.getElementById('i18n-audio-desc').textContent = dict.audioDesc;
    document.getElementById('i18n-aud-none').textContent = dict.audNone;
    document.getElementById('i18n-aud-none-sub').textContent = dict.audNoneSub;
    document.getElementById('i18n-aud-mic').textContent = dict.audMic;
    document.getElementById('i18n-aud-mic-sub').textContent = dict.audMicSub;
    document.getElementById('i18n-aud-sys').textContent = dict.audSys;
    document.getElementById('i18n-aud-sys-sub').textContent = dict.audSysSub;
    document.getElementById('i18n-aud-both').textContent = dict.audBoth;
    document.getElementById('i18n-aud-both-sub').textContent = dict.audBothSub;
    document.getElementById('i18n-lbl-mic-dev').textContent = dict.lblMicDev;

    document.getElementById('i18n-pref-title').textContent = dict.prefTitle;
    document.getElementById('i18n-pref-desc').textContent = dict.prefDesc;
    document.getElementById('i18n-lbl-fps').textContent = dict.lblFps;
    document.getElementById('i18n-lbl-quality').textContent = dict.lblQuality;
    document.getElementById('i18n-chk-min').textContent = dict.chkMin;
    document.getElementById('i18n-chk-count').textContent = dict.chkCount;
    document.getElementById('i18n-btn-start').textContent = dict.btnStart;

    document.getElementById('rec-status-title').textContent = dict.recStatusTitle;
    document.getElementById('i18n-btn-load-vid').textContent = dict.btnLoadVid;
    document.getElementById('i18n-player-empty').textContent = dict.playerEmpty;

    document.getElementById('i18n-tab-markers').textContent = dict.tabMarkers;
    document.getElementById('i18n-tab-range').textContent = dict.tabRange;
    document.getElementById('i18n-tab-equal').textContent = dict.tabEqual;
    document.getElementById('i18n-btn-add-cut').textContent = dict.btnAddCut;
    document.getElementById('i18n-btn-clear-cuts').textContent = dict.btnClearCuts;
    document.getElementById('i18n-seg-header').textContent = dict.segHeader;
    const noCutsEl = document.getElementById('i18n-no-cuts-msg');
    if (noCutsEl) noCutsEl.textContent = dict.noCutsMsg;
    document.getElementById('i18n-btn-export-all').textContent = dict.btnExportAll;

    document.getElementById('i18n-lbl-start').textContent = dict.lblStart;
    document.getElementById('i18n-lbl-end').textContent = dict.lblEnd;
    document.getElementById('i18n-lbl-clip-dur').textContent = dict.lblClipDur;
    document.getElementById('btn-set-start').textContent = dict.btnSetStart;
    document.getElementById('btn-set-end').textContent = dict.btnSetEnd;
    document.getElementById('i18n-btn-export-clip').textContent = dict.btnExportClip;

    document.getElementById('i18n-lbl-equal-parts').textContent = dict.lblEqualParts;
    document.getElementById('i18n-lbl-equal-clips').textContent = dict.lblEqualClips;
    document.getElementById('i18n-btn-export-equal').textContent = dict.btnExportEqual;

    document.getElementById('i18n-set-app').textContent = dict.setApp;
    document.getElementById('i18n-set-shortcuts').textContent = dict.setShortcuts;
    document.getElementById('i18n-key-f9').textContent = dict.keyF9;
    document.getElementById('i18n-key-f10').textContent = dict.keyF10;
    document.getElementById('i18n-key-space').textContent = dict.keySpace;
    document.getElementById('i18n-key-enter').textContent = dict.keyEnter;
    document.getElementById('i18n-key-esc').textContent = dict.keyEsc;
    document.getElementById('i18n-set-export').textContent = dict.setExport;
    document.getElementById('i18n-lbl-def-format').textContent = dict.lblDefFormat;

    document.getElementById('i18n-modal-prompt').textContent = dict.modalPrompt;
    document.getElementById('i18n-modal-btn-save').textContent = dict.modalBtnSave;
    document.getElementById('i18n-modal-btn-split').textContent = dict.modalBtnSplit;
  }

  showProcessing(title, status) {
    this.processingTitle.textContent = title || 'Processing...';
    this.processingStatus.textContent = status || 'Please wait...';
    this.processingModal.style.display = 'flex';
  }

  hideProcessing() {
    this.processingModal.style.display = 'none';
  }

  showToast(message) {
    this.toastEl.textContent = message;
    this.toastEl.style.display = 'block';
    setTimeout(() => {
      this.toastEl.style.display = 'none';
    }, 3200);
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.App = new AppController();
});
