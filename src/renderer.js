

var RATE = null;
var INFO_USERS = null;


var rateInput = document.getElementById('rate');
const rate_us = document.querySelector('.rate-us')
const rate_cn = document.querySelector('.rate-cn')
const rate_cam = document.querySelector('.rate-cam')


window.electronAPI.ipcRenderer.send("test", 'connected successfully');
setInterval(() => {
    window.electronAPI.ipcRenderer.send("test", 'connected successfully');
}, 10000)

const updateRATE = () => {
    const __input_rate = document.querySelector('#rate')
    __input_rate.value = RATE
}


window.electronAPI.ipcRenderer.on('test', (data) => {

    const parseJSON = JSON.parse(data)
    console.log(parseJSON)
    console.log(parseJSON.action == 'get-rate')
    if (parseJSON.action == 'get-rate') {
        rate_us.setAttribute('data-rate',  parseJSON.data[1])
        rate_cn.setAttribute('data-rate',  parseJSON.data[2])
        rate_cam.setAttribute('data-rate',  parseJSON.data[3])

        if (rateInput.getAttribute('rate-type') == rate_us.getAttribute('data-currency')) {
            rateInput.value = parseJSON.data[1]
        }else if (rateInput.getAttribute('rate-type') == rate_cn.getAttribute('data-currency')) {
            rateInput.value = parseJSON.data[2]
        }else if (rateInput.getAttribute('rate-type') == rate_cam.getAttribute('data-currency')) {
            rateInput.value = parseJSON.data[3]
        }
        // RATE = parseJSON.data
        // updateRATE()
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

