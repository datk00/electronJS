const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    ipcRenderer: {
        send: (channel, data) => {
            ipcRenderer.send(channel, data);
        },
        on: (channel, func) => {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        },
        generateQR: (data) => ipcRenderer.invoke('generate-qr', data),
        downloadQR: (data) => ipcRenderer.invoke('download-qr', data),
    },
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    restartApp: () => ipcRenderer.send('restart-app')
});