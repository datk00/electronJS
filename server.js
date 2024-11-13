const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path');
const getDataFromGgsheet = require('./getDataFromSheet.js');

// Giả sử getDataFromGgsheet là một hàm bất đồng bộ, sử dụng async/await
var DataFromSheet = null



// Hàm tạo cửa sổ ứng dụng
let mainWindow;
async function createWindow() {
    // Lấy dữ liệu RATE trước khi tạo cửa sổ
    DataFromSheet = await getDataFromGgsheet()

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'), // Đảm bảo preload.js được nạp đúng
            contextIsolation: true,
        },
    });

    // Tải file HTML
    mainWindow.loadFile('index.html');

    // Ẩn thanh menu mặc định
    Menu.setApplicationMenu(null);

    // Khi cửa sổ đóng
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Mở DevTools khi cửa sổ tạo ra
    // mainWindow.webContents.openDevTools();

    // Lắng nghe sự kiện IPC từ renderer process
    ipcMain.on('test', (event, value) => {
        console.log(value);  // In thông điệp từ renderer
        // Gửi dữ liệu RATE cho renderer
        if (DataFromSheet) {
            event.reply('test', JSON.stringify( {
                action:'get-rate',
                data: DataFromSheet.dataRate[1],
            }));
        }
    });
    ipcMain.on('valid-account', (event, data) => {
        console.log(data.username);  // In thông điệp từ renderer
        const str_data = `${data.username}|${data.password}`
        const isStatus = DataFromSheet.dataInfoUsers.includes(str_data)

        event.reply('test', JSON.stringify({
            action:'valid-account',
            status: isStatus,
        }))
        // Gửi dữ liệu RATE cho renderer

    })
}

// Khi Electron đã sẵn sàng
app.whenReady().then(() => {
    createWindow();

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
