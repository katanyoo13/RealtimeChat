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
                    localStorage.setItem('role', response.role);
                    localStorage.setItem('username', username); // เก็บชื่อผู้ใช้ไว้ใน localStorage

                    if (response.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else if (response.role === 'user') {
                        window.location.href = 'chat.html';
                    } else {
                        alert('You are not authorized to access this page.');
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
