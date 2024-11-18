

var RATE = null;
var INFO_USERS = null;


var rateInput = document.getElementById('rate');
var rate_thue = document.getElementById('rate_thue');
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
        rate_us.setAttribute('data-rate',  parseInt(parseJSON.data[1]))
        rate_cn.setAttribute('data-rate',  parseInt(parseJSON.data[2]))
        rate_cam.setAttribute('data-rate',  parseInt(parseJSON.data[3]))

        if (rateInput.getAttribute('rate-type') == rate_us.getAttribute('data-currency')) {
            rateInput.value = parseInt(parseJSON.data[1])
        }else if (rateInput.getAttribute('rate-type') == rate_cn.getAttribute('data-currency')) {
            rateInput.value = parseInt(parseJSON.data[2])
        }else if (rateInput.getAttribute('rate-type') == rate_cam.getAttribute('data-currency')) {
            rateInput.value = parseInt(parseJSON.data[3])
        }
        rate_thue.value = parseInt(parseJSON.data[1])
        // RATE = parseJSON.data
        // updateRATE()
    }else if (parseJSON.action == 'valid-account') {
        if (parseJSON.status) {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('username', __username);
            localStorage.setItem('password', __password);
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


window.electronAPI.ipcRenderer.on('update-available', (event, info) => {
    console.log('Cập nhật có sẵn:', info);
    // Hiển thị thông báo cập nhật cho người dùng, có thể tạo thông báo popup hoặc cập nhật UI
    alert('Có bản cập nhật mới!');
});

// Lắng nghe sự kiện 'update-not-available' từ Main Process
window.electronAPI.ipcRenderer.on('update-not-available', () => {
    console.log('Không có bản cập nhật nào');
    // Thông báo cho người dùng rằng không có bản cập nhật
    alert('Không có bản cập nhật nào');
});

// Lắng nghe sự kiện lỗi 'update-error' từ Main Process
window.electronAPI.ipcRenderer.on('update-error', (event, err) => {
    console.error('Lỗi khi kiểm tra bản cập nhật:', err);
    // Thông báo lỗi cho người dùng
    alert('Đã có lỗi khi kiểm tra bản cập nhật');
});

// Lắng nghe sự kiện 'update-downloaded' từ Main Process
window.electronAPI.ipcRenderer.on('update-downloaded', (event, info) => {
    console.log('Cập nhật đã tải xong:', info);
    // Thông báo cho người dùng rằng bản cập nhật đã sẵn sàng để cài đặt
    alert('Bản cập nhật đã tải xong!');
});



window.electronAPI.ipcRenderer.on('get-propety-setting', (data) => {

    const parseJSON = JSON.parse(data)
    console.log(parseJSON)
})

