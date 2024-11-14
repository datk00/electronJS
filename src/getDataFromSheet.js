const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT}  =  require('google-auth-library')

const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCj+carbvmGxhrm\nGkwHLAVBN3bjSt4S4iLWC0KtSyXCQj6gwbUI70optRn/6kF9BUubKFYahpQ1emM1\n2RxDbbz26MIe8ihcoAZ6FpDsiyXwuq0q/e4CqIC3+3c4KckKsLiNaHaWqxOkMyYp\ndy0uXzpoRx25Dy/gOCuxnx9Q/ZIIUqPx4m+pKLWCQLu6jT2KlGfI44FLQxbENqbp\nNUChaPmzbBhp2Jwhj8+6fvkcn4hAw0DJgt17u/MxDumVcwd3caOgHQZwtUDi66do\nZf9dCSpFvLUq8VDvHA6sNnGSEf/CfZtQNRQKnMVyd7x9CYMexR+YVbaWQmYI90XP\nDgUGMHvZAgMBAAECggEABcyXru3e3Q98pCKYtFW6w1ionPIDmofHyzRiKa0QqIHC\n2NkKSSbmWMUvBoF0oA0WhGX31++7xjbo0z7AEe9A/uX9Nzk2/cyf4gQ84KLCBx/L\nr/YuVgbQfkFCW9itePzGRXkE8v/uqEYHUtwu8MGH2CgwuCATgELC99Y8oNbbn0KX\nZ88N8Az0kvMYYvfcalii+JzyhfVfdIgjNFmJU3IT7rlH8BC9YmXb0wQHDtfRykGD\ndacvEOGiPU2FsPrjmKDCfEK47yefNn0hM5a+iwJ+K/ll3pDxY/pJME8MG76jBwnR\nZtwX78iDs12cq+vcYgMtJHXug7K392jqACAHhSdQoQKBgQDgDiDsjlyQllmpCKaq\n6zVN5xJ6D/0VIEkhG7VJEMamcXV++ciQ8LQO9Ffl+riGpGdDzjelKvhh8aPbCq3F\n8VWH3pUyjlJ/axzeeajn0pKk9t0OvcgkuGkDfZk5QnnCnJpiB5Yao2OJKjbolfIB\nW/UU9j6Wqg+ZGGIhgSHi5NR0YQKBgQC7WsiyRN4f5bZpCWoENhROI4ZbtDWQQW2t\nqH2txvVek+OTLpxUdY3wgvEZFVoq+tIB/3YWUmhnuusZ5lamelSgvEjFfR/jZ8ON\nnqxJ+90O3jKhDPAvcHWDjYnJCrAws/m8C8cDBqZSBZuxFZLpCoU2hshYKzPrSRgE\nOmgBXJe6eQKBgQDOIlGKMePZpmnxCSOFpoZRGOG36VPXhu+hBUQBZ+zLnyERZC9x\nofKWu5jO3p+8SC81g9lQHTuNqOoukSGVNlaRfWfYrnYaAmr6CAYs2l/OY8y3TkV/\n+yWqb3hz5MPvF3M183LXKTFfNbZ0v9d6Bqdx1Kd6qBVXrcZCuvJ5NDx+oQKBgFKL\n9j8tPpzZLhxrTG2ckie3WTxQUwVC/prz0KPfND6+dBdmAvTncmlUl/uQP9EN/7dn\nodTF7EA/x9P6e5UP8vd63ak9ru4Xyr47+fcC5GvnlHEG7VBJgU078EhG0Eg1E8Q5\ngC6iIGelFurX8YmB3B2hFuZZ6p8w7kb2oNpwvF0pAoGBANDEdEH/r0dWLnYMSdej\nsZkhZJS9UuHumn0LFOZRJRaNSMqtkjXB3XGWA4bvqqW90cREj1vd9UhlOQMno8mX\nXGYknRgf0LvezFtpRaGbQju36keY8OSYNpNSw1B9vjAtUTqZ74WC7LK/xn8pT6aX\nzEGxO6jW35ljaY0fziLoe26I\n-----END PRIVATE KEY-----\n';  // Thay thế PRIVATE_KEY của bạn
const CLIENT_EMAIL = 'ggshet@get-data-gg-sheet-423911.iam.gserviceaccount.com';
const SHEET_ID = '1isURQQppbwnhVvmdWwkidNAbrwJiPCrIMblE7kJnGMw';  // ID của Google Sheet bạn muốn đọc

const serviceAccountAuth = new JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

const getColumnValues = async (doc, columnIndex = 0) => {
    try {
        const sheet = doc.sheetsByIndex[0]; // Hoặc bạn có thể lấy sheet theo ID hoặc tên
        await sheet.loadCells();  // Tải dữ liệu của các ô trong sheet

        // Mảng để chứa các giá trị của cột đã chỉ định
        const values = [];

        // Duyệt qua tất cả các hàng trong sheet để lấy giá trị ở cột đã chỉ định (columnIndex)
        for (let rowIndex = 0; rowIndex < sheet.rowCount; rowIndex++) {
            const cellValue = await sheet.getCell(rowIndex, columnIndex).value;  // Lấy giá trị ô
            if (cellValue) {  // Chỉ thêm vào mảng nếu ô không trống
                values.push(cellValue);
            }
        }

        return values;  // Trả về mảng các giá trị
    } catch (e) {
        console.error('Error while fetching data from the sheet:', e);
    }
};

const getDataFromGgsheet = async () => {
    try {
        // Khởi tạo Google Spreadsheet với ID và chứng thực
        const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();  // Tải thông tin bảng tính

        // Lấy dữ liệu từ cột A (columnIndex = 0)
        const dataRate = await getColumnValues(doc, 0);  // Cột A là columnIndex = 0

        // Lấy dữ liệu từ cột B (columnIndex = 1)
        const dataInfoUsers = await getColumnValues(doc, 1);  // Cột B là columnIndex = 1

        // Trả về kết quả nếu cần
        return { dataRate, dataInfoUsers };
    } catch (e) {
        console.error('Error while fetching data:', e);
    }
};

// (async () => {
//     console.log(await getDataFromGgsheet());
// })();
module.exports  = getDataFromGgsheet