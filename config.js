// Google Sheets Config
const SHEET_ID = '1isURQQppbwnhVvmdWwkidNAbrwJiPCrIMblE7kJnGMw';
const SHEET_NAME = 'datkt'; 
const API_KEY = 'AIzaSyBCL6p-iGQQP8RUw3wOd7eQRoh9G1RuIkc'; 

const CONFIG = {
    SHEET_URL: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`,
    DEFAULT_RATE: 24500, 
};

export default CONFIG;