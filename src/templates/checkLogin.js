window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
  
    // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang login
    if (!isLoggedIn) {
      window.location.href = 'login.html';
    }
  };