// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel, message) => ipcRenderer.send(channel, message),
  onReceiveMessage: (channel, listener) => ipcRenderer.on(channel, listener),
});
