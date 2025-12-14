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
    
    // Check if exe exists
    if (!fs.existsSync(exePath)) {
      reject(new Error(`LumeViewer.exe not found at: ${exePath}`));
      return;
    }

    const command = `"${exePath}" analyze --hash "${hashPath}" --bundle "${bundlePath}"`;
    
    console.log('Running in terminal:', command);
    
    // Spawn in a visible cmd window so user can input password
    const process = spawn('cmd.exe', ['/c', `start /wait cmd.exe /k ${command}`], {
      cwd: app.getAppPath(),
      shell: true,
      detached: true
    });

    // Since we're opening a separate terminal, we can't capture output directly
    // The terminal will stay open for user interaction
    process.on('error', (err) => {
      reject(err);
    });

    // Resolve immediately since the terminal is interactive
    // User will see the output in the terminal window
    setTimeout(() => {
      resolve({ success: true, output: 'Analysis started in terminal window. Please enter the password in the command prompt.' });
    }, 1000);
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
