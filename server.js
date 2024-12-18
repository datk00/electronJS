const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const getDataFromGgsheet = require('./src/getDataFromSheet.js');
const { JsonDB, Config } = require('node-json-db');
const db = new JsonDB(new Config("settings", true, false, '/'));
const QRCode = require('qrcode')
const { autoUpdater, AppUpdater } = require('electron-updater');
const fs = require('fs');


// const log = require('electron-log');

// const pathToLogFile = path.join('D:/Desktop/code_tool_tele/electronJS/src', 'logs', 'main.log');

// log.transports.file.resolvePathFn = () => pathToLogFile;

// log.info("APP version: " + app.getVersion())

var DataFromSheet = null;
let mainWindow;



autoUpdater.on("checking-for-update", () => {
    mainWindow.webContents.send('checking-update');
});

autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send('update-available', info);
});

autoUpdater.on("update-not-available", (info) => {
    mainWindow.webContents.send('update-not-available', info);
});

autoUpdater.on("error", (err) => {
    mainWindow.webContents.send('update-error', err);
});

autoUpdater.on("download-progress", (progressTrack) => {
    mainWindow.webContents.send('update-progress', progressTrack);
});

autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send('update-downloaded');
});

// Restart app handler
ipcMain.on('restart-app', () => {
    autoUpdater.quitAndInstall();
});


async function createWindow() {
    // Lấy dữ liệu RATE trước khi tạo cửa sổ
    DataFromSheet = await getDataFromGgsheet();
    console.log(DataFromSheet);
    
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, './src/preload.js'),
            contextIsolation: true,
        },
    });

    // Tải file HTML
    mainWindow.loadFile('./src/templates/login.html');

    // Ẩn thanh menu mặc định
    Menu.setApplicationMenu(null);

    // Khôi phục trạng thái ghim cửa sổ
    try {
        const isPinned = await db.getData("/isPinned");
        if (isPinned) {
            mainWindow.setAlwaysOnTop(true);
        }
    } catch (error) {
        await db.push("/isPinned", false);
    }

    // Khi cửa sổ đóng
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Mở DevTools khi cửa sổ tạo ra
    // mainWindow.webContents.openDevTools();


}

// Lắng nghe sự kiện IPC từ renderer process

ipcMain.on('getVersionApp', async (event, data) => {
    const appVersion = app.getVersion()
    event.reply('getVersionApp', {
        appVersion
    })
})


ipcMain.on('test', async (event, value) => {
    const isPinned = await db.getData("/isPinned");
    const autoStart = await  db.getData("/autoStart");
    console.log(`isPinned: ${isPinned}, autoStart: ${autoStart}`)
    console.log(value);
    if (DataFromSheet) {
        event.reply('test', JSON.stringify({
            action: 'get-rate',
            data: DataFromSheet.dataRate,
        }));
    }
});

ipcMain.on('auto-collect-users', async (event, str_data) => {
    DataFromSheet = await getDataFromGgsheet()
    let users = DataFromSheet.dataInfoUsers
    console.log(`str_data:  ${str_data}`)
    let isExist = users.includes(str_data)
    event.reply('auto-collect-users', `${isExist}`)
})

ipcMain.on('valid-account', async (event, data) => {
    DataFromSheet = await getDataFromGgsheet()

    const str_data = `${data.username}|${data.password}`;
    const isStatus = DataFromSheet.dataInfoUsers.includes(str_data);

    event.reply('test', JSON.stringify({
        action: 'valid-account',
        status: isStatus,
    }));
});

// Xử lý sự kiện ghim cửa sổ
ipcMain.on('toggle-pin-window', (event, value) => {
    mainWindow.setAlwaysOnTop(value);
    db.push("/isPinned", value);
});

// Xử lý sự kiện tự động khởi động
ipcMain.on('toggle-auto-start', (event, value) => {
    app.setLoginItemSettings({
        openAtLogin: value
    });
    db.push("/autoStart", value);
});

// Gửi trạng thái ban đầu cho renderer
ipcMain.on('get-initial-state', (event) => {
    try {
        const isPinned = db.getData("/isPinned");
        const autoStart = db.getData("/autoStart");
        event.reply('initial-state', { isPinned, autoStart });
    } catch (error) {
        event.reply('initial-state', { isPinned: false, autoStart: false });
    }
});

// Khi Electron đã sẵn sàng
app.whenReady().then(async () => {
    await createWindow();
    autoUpdater.checkForUpdatesAndNotify()

    // Kiểm tra và thiết lập autostart
    try {
        const shouldAutoStart = await db.getData("/autoStart");
        app.setLoginItemSettings({
            openAtLogin: shouldAutoStart
        });
    } catch (error) {
        await db.push("/autoStart", false);
    }

    // Khi ứng dụng được kích hoạt (trong macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });



});


// Handle QR code generation
ipcMain.handle('generate-qr', async (event, data) => {
    try {
        const { content, errorCorrection, size } = data;
        const options = {
            errorCorrectionLevel: errorCorrection,
            width: parseInt(size),
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        };

        // Generate QR code as data URL
        const dataUrl = await QRCode.toDataURL(content, options);
        return { success: true, dataUrl };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Handle QR code download
ipcMain.handle('download-qr', async (event, data) => {
    try {
        const { content, errorCorrection, size, filePath } = data;
        const options = {
            errorCorrectionLevel: errorCorrection,
            width: parseInt(size),
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        };

        // Generate QR code and save to file
        await QRCode.toFile(filePath, content, options);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Khi tất cả cửa sổ đóng
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
