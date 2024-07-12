$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault();

        const username = $('#username').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirm_password = $('#confirm_password').val();

        $.ajax({
            type: 'POST',
            url: '/api/register',
            contentType: 'application/json',
            data: JSON.stringify({ username, email, password, confirm_password }),
            success: function(response) {
                alert(response.message);
                if (response.message === 'User created') {
                    window.location.href = 'login.html';
                }
            },
            error: function(error) {
                console.error('Register error:', error);
                alert('Register failed: ' + error.responseText);
            }
        });
    });
});
