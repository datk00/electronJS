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
    // Lấy phần tử modal và phần tử chứa message
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");

    // Thêm nội dung thông điệp vào modal
    modalMessage.textContent = message;

    // Hiển thị modal
    modal.classList.remove("hidden");
}

function closeModal() {
    const modal = document.getElementById("customModal");

    // Ẩn modal
    modal.classList.add("hidden");
}