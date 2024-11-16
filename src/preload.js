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
    }
});