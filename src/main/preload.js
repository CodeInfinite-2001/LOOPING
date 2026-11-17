const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Screen sources
  getSources: () => ipcRenderer.invoke('get-sources'),

  // Area Selection Overlay
  openAreaSelector: () => ipcRenderer.invoke('open-area-selector'),
  onAreaSelected: (callback) => {
    ipcRenderer.on('area-selected-result', (event, data) => callback(data));
  },
  onAreaCancelled: (callback) => {
    ipcRenderer.on('area-cancelled-result', () => callback());
  },

  // Recording Border Overlay
  showRecordingBorder: (rect) => ipcRenderer.send('show-recording-border', rect),
  hideRecordingBorder: () => ipcRenderer.send('hide-recording-border'),

  // Mini Bar
  showMiniBar: () => ipcRenderer.send('show-mini-bar'),
  hideMiniBar: () => ipcRenderer.send('hide-mini-bar'),
  updateMiniBarTimer: (timeStr) => ipcRenderer.send('update-mini-bar-timer', timeStr),
  updateMiniBarPause: (isPaused) => ipcRenderer.send('update-mini-bar-pause', isPaused),

  // Save / Disk operations
  saveVideoBuffer: (buffer, extension) => ipcRenderer.invoke('save-video-buffer', buffer, extension),
  saveTempVideo: (buffer) => ipcRenderer.invoke('save-temp-video', buffer),
  selectSavePath: (defaultName) => ipcRenderer.invoke('select-save-path', defaultName),
  selectOpenVideo: () => ipcRenderer.invoke('select-open-video'),
  showInFolder: (filePath) => ipcRenderer.send('show-in-folder', filePath),

  // FFmpeg operations
  convertToMp4: (inputPath, outputPath) => ipcRenderer.invoke('convert-to-mp4', inputPath, outputPath),
  splitVideoSegment: (inputPath, startSec, endSec, outputPath) =>
    ipcRenderer.invoke('split-video-segment', inputPath, startSec, endSec, outputPath),
  splitVideoMultiple: (inputPath, segments, outputDir) =>
    ipcRenderer.invoke('split-video-multiple', inputPath, segments, outputDir),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  getVideoDuration: (inputPath) => ipcRenderer.invoke('get-video-duration', inputPath),

  // Main control events from Mini Bar or Shortcuts
  onShortcutAction: (callback) => {
    ipcRenderer.on('shortcut-action', (event, action) => callback(action));
  },

  // Window Controls
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close')
});
