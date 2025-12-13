const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  analyzeBundle: (bundlePath, hashPath) => 
    ipcRenderer.invoke('analyze-bundle', { bundlePath, hashPath }),
  
  selectFile: (filters, title) => 
    ipcRenderer.invoke('select-file', { filters, title }),
  
  onAnalyzeProgress: (callback) => {
    ipcRenderer.on('analyze-progress', (event, data) => callback(data));
  },
  
  isElectron: true
});
