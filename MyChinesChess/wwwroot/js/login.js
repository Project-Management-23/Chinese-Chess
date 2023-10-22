
// Lấy các phần tử DOM
const loginForm = document.getElementById('loginForm');
const registerButton = document.getElementById('registerButton');

// Xử lý sự kiện khi nhấn nút "Đăng ký"
registerButton.addEventListener('click', function () {
    // Điều hướng đến trang đăng ký
    window.location.href = 'https://localhost:7295/Accounts/SignUp';
});

$(document).ready(function () {
    // Xử lý sự kiện khi người dùng nhấn nút "Đăng nhập"
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        // Lấy giá trị từ các trường nhập liệu
        var username = $('#Username').val();
        var password = $('#Password').val();

        // Gọi API đăng nhập
        $.ajax({
            url: 'https://localhost:7295/api/Login/loginacc',
            method: 'POST',
            data: JSON.stringify({
                Username: username,
                Password: password
            }),
            contentType: 'application/json',
            success: function (response) {
                // Kiểm tra kết quả từ API
                if (response.token) {
                    // Đăng nhập thành công, thực hiện các hành động tiếp theo
                    alert('Đăng nhập thành công!');
                    // Lưu token vào localStorage hoặc cookie (tuỳ theo yêu cầu)
                    // Ví dụ:
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    window.location.replace('https://localhost:7295/');
                } else {
                    // Đăng nhập thất bại, hiển thị thông báo lỗi
                    alert('Đăng nhập thất bại!');
                }
            },
            error: function () {
                // Xử lý lỗi nếu có
                alert('Đã xảy ra lỗi khi gọi API.');
            }
        });
    });
});