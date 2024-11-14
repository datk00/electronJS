const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const getDataFromGgsheet = require('./src/getDataFromSheet.js');
const { JsonDB, Config } = require('node-json-db');
const db = new JsonDB(new Config("settings", true, false, '/'));

var DataFromSheet = null;
let mainWindow;

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
    mainWindow.loadFile('./src/templates/index.html');

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
    mainWindow.webContents.openDevTools();
}

// Lắng nghe sự kiện IPC từ renderer process
ipcMain.on('test', async (event, value) => {
    const isPinned = await db.getData("/isPinned");
    const autoStart = await  db.getData("/autoStart");
    console.log(`isPinned: ${isPinned}, autoStart: ${autoStart}`)
    console.log(value);
    if (DataFromSheet) {
        event.reply('test', JSON.stringify({
            action: 'get-rate',
            data: DataFromSheet.dataRate[1],
        }));
    }
});

ipcMain.on('valid-account', (event, data) => {
    console.log(data.username);
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

// Khi tất cả cửa sổ đóng
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
