const QRCode = require('qrcode');

const imageUrl = 'https://noithatbinhminh.com.vn/wp-content/uploads/2022/08/anh-dep-40.jpg';  // URL của ảnh đã được tải lên

QRCode.toDataURL(imageUrl, function (err, url) {
  if (err) throw err;
  console.log(url);  // Đầu ra là mã QR chứa URL của ảnh
});