

var RATE = null;
var INFO_USERS = null;

window.electronAPI.ipcRenderer.send("test", 'connected successfully');

const updateRATE = () => {
    const __input_rate = document.querySelector('#rate')
    __input_rate.value = RATE
}


window.electronAPI.ipcRenderer.on('test', (data) => {

    const parseJSON = JSON.parse(data)
    console.log(parseJSON)
    console.log(parseJSON.action == 'get-rate')
    if (parseJSON.action == 'get-rate') {
        RATE = parseJSON.data
        updateRATE()
    }else if (parseJSON.action == 'valid-account') {
        if (parseJSON.status) {
            localStorage.setItem('isLoggedIn', true);
            window.location.href = 'index.html';
            // document.getElementById('loginContainer').classList.add('hidden');
            // document.getElementById('mainContainer').classList.remove('hidden');
            // initTheme(); 
        } else {
            localStorage.setItem('isLoggedIn', false);
            showModal('Thông tin đăng nhập không chính xác')
        }
    }

})



window.electronAPI.ipcRenderer.on('get-propety-setting', (data) => {

    const parseJSON = JSON.parse(data)
    console.log(parseJSON)
})

