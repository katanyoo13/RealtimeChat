$(document).ready(function() {
    $('#loginForm').submit(function(event) {
        event.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/api/login',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                if (response.success) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', username); // เก็บชื่อผู้ใช้ใน localStorage
                    localStorage.setItem('role', response.role);
                    if (response.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'chat.html';
                    }
                } else {
                    alert(response.message);
                }
            },
            error: function(error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.responseText);
            }
        });
    });
});
