// Elements
var name_user = document.querySelector('.__name')
name_user.textContent = localStorage.getItem('userName')

const darkModeToggle = document.getElementById('darkMode');
const pinAppToggle = document.getElementById('pinWindow');
const startAppWithWindowsToggle = document.getElementById('startWithWindows');
const notificationsToggle = document.getElementById('notifications');
const emailInput = document.getElementById('notificationEmail');
const htmlElement = document.documentElement;



// Load preferences from localStorage
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    htmlElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }
}

function loadPinAppPreference() {
    const isPinned = localStorage.getItem('pinApp') === 'true';
    if (pinAppToggle) {
        pinAppToggle.checked = isPinned;
    }
}

function loadStartAppWithWindowsPreference() {
    const shouldAutoStart = localStorage.getItem('startWithWindows') === 'true';
    if (startAppWithWindowsToggle) {
        startAppWithWindowsToggle.checked = shouldAutoStart;
    }
}

function loadNotificationsPreference() {
    const notificationsEnabled = localStorage.getItem('notifications') === 'true';
    if (notificationsToggle) {
        notificationsToggle.checked = notificationsEnabled;
    }
}

function loadEmailPreference() {
    const savedEmail = localStorage.getItem('notificationEmail');
    if (emailInput && savedEmail) {
        emailInput.value = savedEmail;
    }
}

// Initialize preferences on page load
loadDarkModePreference();
loadPinAppPreference();
loadStartAppWithWindowsPreference();
loadNotificationsPreference();
loadEmailPreference();

// Event listeners
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        const isDarkMode = this.checked;
        htmlElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', isDarkMode);
    });
}

if (pinAppToggle) {
    pinAppToggle.addEventListener('change', function() {
        const isPinApp = this.checked;
        window.electronAPI.ipcRenderer.send('toggle-pin-window', isPinApp);
        localStorage.setItem('pinApp', isPinApp);
    });
}

if (startAppWithWindowsToggle) {
    startAppWithWindowsToggle.addEventListener('change', function() {
        const isStartWithWindows = this.checked;
        window.electronAPI.ipcRenderer.send('toggle-auto-start', isStartWithWindows);
        localStorage.setItem('startWithWindows', isStartWithWindows);
    });
}

if (notificationsToggle) {
    notificationsToggle.addEventListener('change', function() {
        const notificationsEnabled = this.checked;
        localStorage.setItem('notifications', notificationsEnabled);
        window.electronAPI.ipcRenderer.send('toggle-notifications', notificationsEnabled);
    });
}

if (emailInput) {
    emailInput.addEventListener('change', function() {
        const email = this.value.trim();
        if (email && isValidEmail(email)) {
            localStorage.setItem('notificationEmail', email);
            window.electronAPI.ipcRenderer.send('update-notification-email', email);
        }
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// [Rest of your existing code remains the same]


const btnLogout = document.querySelector('.logout')
btnLogout.addEventListener('click', (e) => {
    e.preventDefault()

    localStorage.setItem('isLoggedIn', false);
    window.location.href = 'login.html';


})
function showModal(message) {
    const modal = document.getElementById('customModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('customModal');
    modal.classList.add('hidden');
}
function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatNumberVnd(num) {
    return num.toLocaleString()
}

function convert() {
    var rateInput = document.querySelector('#rate')
    var amount = document.getElementById('amount').value;
    const rate = parseFloat(document.getElementById('rate').value);
    const conversionType = document.getElementById('conversionType').value;
    const resultElement = document.getElementById('result');

    // Loại bỏ dấu phẩy trong phần số nguyên trước khi chuyển thành số
    amount = amount.replace(/,/g, '');  // Loại bỏ tất cả dấu phẩy

    // Chuyển đổi amount thành số thực
    amount = parseFloat(amount);  // parseFloat() sẽ trả về NaN nếu input không hợp lệ

    if (isNaN(amount) || isNaN(rate)) {
        showModal('Nhập số vào đồ ngu');
        return;
    }

    var charM = null;
    const atb_rate = rateInput.getAttribute('rate-type')
    if (atb_rate == 'USD') {
        charM = '$';
    }else if (atb_rate == 'CNY') {
        charM = '¥';
    }else if (atb_rate == 'KHR') {
        charM = '៛';
    }


    let result;
    let message;

    switch (conversionType) {
        case '*':
            result = amount * rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn là: ${formatNumber(amount)} ${charM} * ${formatNumberVnd(rate)} = ${formatNumberVnd(result)} VND.`;
            break;
        case '/':
            if (rate === 0) {
                showModal('Không thể chia cho 0. Vui lòng nhập giá trị khác.');
                return;
            }
            result = amount / rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn là: ${formatNumberVnd(amount)} VND / ${formatNumberVnd(rate)} = ${formatNumber(result)} ${charM}.`;
            break;
        case '-5%':
            result = amount * 0.95 * rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} ${charM} - 5% * ${formatNumberVnd(rate)} = ${formatNumberVnd(result)} VND.`;
            break;
        case '-10%':
            result = amount * 0.9 * rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} ${charM} - 10% * ${formatNumberVnd(rate)} = ${formatNumberVnd(result)} VND.`;
            break;
        case '-15%':
            result = amount * 0.85 * rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} ${charM} - 15% * ${formatNumberVnd(rate)} = ${formatNumberVnd(result)} VND.`;
            break;
        case '-20%':
            result = amount * 0.8 * rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} ${charM} - 20% * ${formatNumberVnd(rate)} = ${formatNumberVnd(result)} VND.`;
            break;
    }

    // Hiển thị kết quả và sao chép vào clipboard
    resultElement.textContent = message;
    navigator.clipboard.writeText(message);
}


function reset() {
    document.getElementById('amount').value = '';
    // document.getElementById('rate').value = '';
    document.getElementById('conversionType').value = '*';
    document.getElementById('result').textContent = '';
}


    // Close modal when clicking outside
    document.getElementById('customModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            closeModal()
        }
    })


