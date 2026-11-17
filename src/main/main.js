const { app, BrowserWindow, ipcMain, desktopCapturer, dialog, shell, globalShortcut, screen, session } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpegHelper = require('./ffmpeg-helper');

// Enable PipeWire for Linux Wayland & hardware acceleration flags
app.commandLine.appendSwitch('enable-features', 'WebRTCPipeWireCapturer');

let mainWindow = null;
let areaWindow = null;
let borderWindow = null;
let miniBarWindow = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1060,
    height: 740,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: '#0b0f19',
    title: 'LOOPING',
    icon: path.join(__dirname, '../../assets/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (areaWindow && !areaWindow.isDestroyed()) areaWindow.close();
    if (borderWindow && !borderWindow.isDestroyed()) borderWindow.close();
    if (miniBarWindow && !miniBarWindow.isDestroyed()) miniBarWindow.close();
  });
}

// Global Hotkeys
function registerHotkeys() {
  try {
    globalShortcut.register('F9', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('shortcut-action', 'toggle-record');
      }
    });

    globalShortcut.register('F10', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('shortcut-action', 'toggle-pause');
      }
    });
  } catch (err) {
    console.warn('Could not register global shortcuts:', err);
  }
}

app.whenReady().then(() => {
  // Grant media permissions automatically (Microphone, Screen Capture)
  session.defaultSession.setPermissionCheckHandler(() => true);
  session.defaultSession.setPermissionRequestHandler((wc, perm, cb) => cb(true));

  createMainWindow();
  registerHotkeys();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC: Get Screen Sources
ipcMain.handle('get-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: { width: 320, height: 180 },
      fetchWindowIcons: true
    });
    return sources.map(src => ({
      id: src.id,
      name: src.name,
      thumbnail: src.thumbnail.toDataURL(),
      display_id: src.display_id
    }));
  } catch (err) {
    console.error('Failed to get sources:', err);
    throw err;
  }
});

// IPC: Open Area Selector Overlay
ipcMain.handle('open-area-selector', async () => {
  if (areaWindow && !areaWindow.isDestroyed()) {
    areaWindow.focus();
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  areaWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'overlay-preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  areaWindow.loadFile(path.join(__dirname, 'area-overlay.html'));

  areaWindow.on('closed', () => {
    areaWindow = null;
  });
});

ipcMain.on('area-selected', (event, rect) => {
  if (areaWindow && !areaWindow.isDestroyed()) {
    areaWindow.close();
    areaWindow = null;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('area-selected-result', rect);
    mainWindow.restore();
    mainWindow.focus();
  }
});

ipcMain.on('area-selection-cancelled', () => {
  if (areaWindow && !areaWindow.isDestroyed()) {
    areaWindow.close();
    areaWindow = null;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('area-cancelled-result');
    mainWindow.restore();
    mainWindow.focus();
  }
});

// Recording Border Overlay (Visual indicator on screen during area recording)
ipcMain.on('show-recording-border', (event, rect) => {
  if (!borderWindow || borderWindow.isDestroyed()) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.bounds;

    borderWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width,
      height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      fullscreen: true,
      skipTaskbar: true,
      focusable: false,
      hasShadow: false,
      webPreferences: {
        preload: path.join(__dirname, 'overlay-preload.js'),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    borderWindow.setIgnoreMouseEvents(true);
    borderWindow.loadFile(path.join(__dirname, 'recording-border.html'));

    borderWindow.webContents.once('did-finish-load', () => {
      borderWindow.webContents.send('update-border', rect);
    });
  } else {
    borderWindow.webContents.send('update-border', rect);
  }
});

ipcMain.on('hide-recording-border', () => {
  if (borderWindow && !borderWindow.isDestroyed()) {
    borderWindow.close();
    borderWindow = null;
  }
});

// Mini Floating Pill Bar
ipcMain.on('show-mini-bar', () => {
  if (miniBarWindow && !miniBarWindow.isDestroyed()) return;

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workArea;

  miniBarWindow = new BrowserWindow({
    width: 290,
    height: 52,
    x: Math.round((width - 290) / 2),
    y: 30,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'overlay-preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  miniBarWindow.loadFile(path.join(__dirname, 'mini-bar.html'));

  miniBarWindow.on('closed', () => {
    miniBarWindow = null;
  });

  // Minimize main window to avoid getting recorded in full screen
  if (mainWindow && !mainWindow.isMinimized()) {
    mainWindow.minimize();
  }
});

ipcMain.on('hide-mini-bar', () => {
  if (miniBarWindow && !miniBarWindow.isDestroyed()) {
    miniBarWindow.close();
    miniBarWindow = null;
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.restore();
    mainWindow.focus();
  }
});

ipcMain.on('update-mini-bar-timer', (event, timeStr) => {
  if (miniBarWindow && !miniBarWindow.isDestroyed()) {
    miniBarWindow.webContents.send('update-timer', timeStr);
  }
});

ipcMain.on('update-mini-bar-pause', (event, isPaused) => {
  if (miniBarWindow && !miniBarWindow.isDestroyed()) {
    miniBarWindow.webContents.send('update-pause-state', isPaused);
  }
});

// Mini bar actions forward to main window
ipcMain.on('action-toggle-pause', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('shortcut-action', 'toggle-pause');
  }
});

ipcMain.on('action-stop-recording', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('shortcut-action', 'stop-recording');
  }
});

ipcMain.on('action-restore-main', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.restore();
    mainWindow.focus();
  }
});

// File Save Operations
ipcMain.handle('select-save-path', async (event, defaultName) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Recording - LOOPING',
    defaultPath: path.join(app.getPath('videos'), defaultName || `LOOPING_${Date.now()}.mp4`),
    filters: [
      { name: 'MP4 Video', extensions: ['mp4'] },
      { name: 'WebM Video', extensions: ['webm'] }
    ]
  });
  return result.canceled ? null : result.filePath;
});

ipcMain.handle('save-video-buffer', async (event, arrayBuffer, targetPath) => {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await fs.promises.writeFile(targetPath, buffer);
    return { success: true, filePath: targetPath };
  } catch (err) {
    console.error('Save buffer error:', err);
    throw err;
  }
});

ipcMain.handle('save-temp-video', async (event, arrayBuffer) => {
  try {
    const buffer = Buffer.from(arrayBuffer);
    const tempDir = app.getPath('temp');
    const rawPath = path.join(tempDir, `looping_raw_${Date.now()}.webm`);
    await fs.promises.writeFile(rawPath, buffer);

    // Finalize raw WebM into standard, seekable MP4 with duration and keyframe index table
    const finalMp4Path = path.join(tempDir, `looping_final_${Date.now()}.mp4`);
    await ffmpegHelper.finalizeRecording(rawPath, finalMp4Path);

    return { success: true, filePath: finalMp4Path, rawPath };
  } catch (err) {
    console.error('Save/Finalize temp error:', err);
    throw err;
  }
});

ipcMain.handle('select-open-video', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Video to Split / Edit - LOOPING',
    properties: ['openFile'],
    filters: [
      { name: 'Video Files', extensions: ['mp4', 'webm', 'mkv', 'mov', 'avi'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('select-output-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Folder for Split Clips - LOOPING',
    properties: ['openDirectory', 'createDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.on('show-in-folder', (event, filePath) => {
  if (fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
  }
});

// FFmpeg IPC handlers
ipcMain.handle('convert-to-mp4', async (event, inputPath, outputPath) => {
  return await ffmpegHelper.convertToMp4(inputPath, outputPath);
});

ipcMain.handle('split-video-segment', async (event, inputPath, startSec, endSec, outputPath) => {
  return await ffmpegHelper.splitVideoSegment(inputPath, startSec, endSec, outputPath);
});

ipcMain.handle('split-video-multiple', async (event, inputPath, segments, outputDir) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ext = path.extname(inputPath) || '.mp4';
  const baseName = path.basename(inputPath, ext);
  const results = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const segmentName = seg.name || `${baseName}_part_${i + 1}`;
    const outPath = path.join(outputDir, `${segmentName}${ext}`);
    const res = await ffmpegHelper.splitVideoSegment(inputPath, seg.start, seg.end, outPath);
    results.push({ ...res, index: i + 1, name: segmentName, outPath });
  }

  return { success: true, results, count: results.length };
});

ipcMain.handle('get-video-duration', async (event, inputPath) => {
  return await ffmpegHelper.getVideoDuration(inputPath);
});

// Window controls
ipcMain.on('window-minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
});
ipcMain.on('window-maximize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.close();
});
