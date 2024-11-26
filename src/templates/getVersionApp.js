
window.electronAPI.ipcRenderer.send('getVersionApp',null)


window.electronAPI.ipcRenderer.on('getVersionApp', (data) => {
    var titleThisPage = `${document.title} <codeVersion: ${data.appVersion}>`
    document.title = titleThisPage
})