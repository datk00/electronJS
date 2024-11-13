

var RATE = null;
var INFO_USERS = null;

window.electronAPI.sendValue('connected successfully');

const updateRATE = () => {
    const __input_rate = document.querySelector('#rate')
    __input_rate.value = RATE
}


window.electronAPI.onMessage((event, data) => {
    const parseJSON = JSON.parse(data)
    console.log(parseJSON.action == 'get-rate')
    if (parseJSON.action == 'get-rate') {
        RATE = parseJSON.data
        updateRATE()
    }else if (parseJSON.action == 'valid-account') {
        if (parseJSON.status) {
            document.getElementById('loginContainer').classList.add('hidden');
            document.getElementById('mainContainer').classList.remove('hidden');
            initTheme(); 
        } else {
            showModal('Thông tin đăng nhập không chính xác')
        }
    }

})

