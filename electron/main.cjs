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
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
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

// Handle analyze request from renderer
ipcMain.handle('analyze-bundle', async (event, { bundlePath, hashPath }) => {
  return new Promise((resolve, reject) => {
    const exePath = path.join(app.getAppPath(), 'LumeViewer.exe');
    
    // Check if exe exists
    if (!fs.existsSync(exePath)) {
      reject(new Error(`LumeViewer.exe not found at: ${exePath}`));
      return;
    }

    const args = ['analyze', '--hash', hashPath, '--bundle', bundlePath];
    
    console.log('Running:', exePath, args.join(' '));
    
    const process = spawn(exePath, args, {
      cwd: app.getAppPath()
    });

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
      // Send progress to renderer
      mainWindow.webContents.send('analyze-progress', data.toString());
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    process.on('error', (err) => {
      reject(err);
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
