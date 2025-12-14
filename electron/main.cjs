const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // In development, load from Vite dev server
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Debug: log when page loads or fails
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle analyze request from renderer - opens in a visible terminal for password input
ipcMain.handle('analyze-bundle', async (event, { bundlePath, hashPath }) => {
  return new Promise((resolve, reject) => {
    const exePath = path.join(app.getAppPath(), 'LumeViewer.exe');
    const outputDir = path.join(app.getAppPath(), 'public', 'analyzed');
    const os = require('os');
    
    // Check if exe exists
    if (!fs.existsSync(exePath)) {
      reject(new Error(`LumeViewer.exe not found at: ${exePath}`));
      return;
    }

    // Clean up existing analyzed directory to avoid permission issues
    try {
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
        console.log('Cleaned up existing analyzed directory');
      }
    } catch (e) {
      console.log('Cleanup warning:', e.message);
    }

    console.log('Running:', exePath);
    console.log('Hash:', hashPath);
    console.log('Bundle:', bundlePath);
    
    // Create a temp batch file to avoid quoting issues
    const batchContent = `@echo off
cd /d "${app.getAppPath()}"
"${exePath}" analyze --hash "${hashPath}" --bundle "${bundlePath}"
echo.
echo Analysis finished. Press any key to close...
pause >nul
`;
    const batchPath = path.join(os.tmpdir(), 'lume_analyze.bat');
    fs.writeFileSync(batchPath, batchContent);
    
    console.log('Batch file:', batchPath);
    console.log('Batch content:', batchContent);
    
    // Watch for the analyzed folder to appear/update
    let watcher = null;
    let resolved = false;
    const watchTimeout = setTimeout(() => {
      if (watcher) watcher.close();
    }, 300000); // 5 min timeout
    
    // Start watching for completion
    const checkCompletion = () => {
      if (resolved) return;
      const manifestPath = path.join(outputDir, 'MANIFEST.json');
      if (fs.existsSync(manifestPath)) {
        resolved = true;
        clearTimeout(watchTimeout);
        if (watcher) watcher.close();
        // Notify renderer that analysis is complete
        mainWindow.webContents.send('analysis-complete');
        resolve({ success: true, output: 'Analysis complete!' });
      }
    };
    
    // Create output dir watcher
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      watcher = fs.watch(outputDir, (eventType, filename) => {
        if (filename === 'MANIFEST.json') {
          setTimeout(checkCompletion, 1000); // Wait a bit for file to be fully written
        }
      });
    } catch (e) {
      console.log('Watch error:', e);
    }
    
    // Use exec to run the batch file in a new visible terminal
    const { exec } = require('child_process');
    
    exec(`start "" /wait "${batchPath}"`, { cwd: app.getAppPath() }, (error, stdout, stderr) => {
      console.log('Terminal closed');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
      
      // Clean up batch file
      try { fs.unlinkSync(batchPath); } catch (e) {}
      
      if (error) {
        console.error('Exec error:', error);
        // Don't reject - check if output was still created
      }
      
      // Check for completion after terminal closes
      setTimeout(checkCompletion, 500);
    });
  });
});

// Handle file dialog
ipcMain.handle('select-file', async (event, { filters, title }) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title,
    filters,
    properties: ['openFile']
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});
