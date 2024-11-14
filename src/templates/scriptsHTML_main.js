// Elements
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
function formatNumber(number) {
    // return new Intl.NumberFormat('vi-VN').format(number);
    return number.toLocaleString();
}

function convert() {
    var amount = document.getElementById('amount').value
    console.log(amount)
    const rate = parseFloat(document.getElementById('rate').value);
    const conversionType = document.getElementById('conversionType').value;
    const resultElement = document.getElementById('result');
    amount = amount.replace(',', '')
    if (!amount || !rate) {
        showModal('Nhập số vào đồ ngu');
        return;
    }

    let result;
    let message;

    switch (conversionType) {
        case '*':
            result = Math.round(amount * rate);
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn là: ${formatNumber(amount)} $ * ${formatNumber(rate)} = ${formatNumber(result)} VND.`;
            break;
        case '/':
            if (rate === 0) {
                showModal('Không thể chia cho 0. Vui lòng nhập giá trị khác.');
                return;
            }
            result = amount / rate;
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn là: ${formatNumber(amount)} VND / ${formatNumber(rate)} = ${result.toFixed(2)} $.`;
            break;
        case '-5%':
            result = Math.round(amount * 0.95 * rate);
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} $ - 5% * ${formatNumber(rate)} = ${formatNumber(result)} VND.`;
            break;
        case '-10%':
            result = Math.round(amount * 0.9 * rate);
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} $ - 10% * ${formatNumber(rate)} = ${formatNumber(result)} VND.`;
            break;
        case '-15%':
            result = Math.round(amount * 0.85 * rate);
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} $ - 15% * ${formatNumber(rate)} = ${formatNumber(result)} VND.`;
            break;
        case '-20%':
            result = Math.round(amount * 0.8 * rate);
            message = `Chào bạn. Tỷ giá hoán đổi đơn hàng của bạn áp dụng mã giảm giá là: ${formatNumber(amount)} $ - 20% * ${formatNumber(rate)} = ${formatNumber(result)} VND.`;
            break;
    }

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