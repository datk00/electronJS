const { contextBridge, ipcRenderer } = require('electron')



contextBridge.exposeInMainWorld('electronAPI', {
  sendValue: (value) => ipcRenderer.send('test', value),
  validAccount: (username, password) => ipcRenderer.send('valid-account', {username, password}),
  onMessage: (callback) =>  ipcRenderer.on('test', (event, data) => callback(event, data))
})
