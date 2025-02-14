$(document).ready(function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/api/currentUser',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(user) {
            $('#username').val(user.username);
            const profileImagePath = user.profilePicture ? `uploads/${user.profilePicture}` : 'uploads/default.png';
            $('#userProfileImage').attr('src', profileImagePath); // ปรับเส้นทางรูปภาพ
            localStorage.setItem('role', user.role); // เก็บ role ของผู้ใช้ใน localStorage
        },
        error: function(error) {
            console.error('Error fetching user:', error);
        }
    });

    $('#profileForm').submit(function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const role = localStorage.getItem('role'); // ดึง role ของผู้ใช้จาก localStorage

        let updateUrl;
        if (role === 'admin') {
            updateUrl = '/api/updateAdminProfile';
        } else {
            updateUrl = '/api/updateUserProfile';
        }

        $.ajax({
            type: 'POST',
            url: updateUrl,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert(response.message);
                const profileImagePath = response.user.profilePicture ? `uploads/${response.user.profilePicture}` : 'uploads/default.png';
                $('#userProfileImage').attr('src', profileImagePath);
                localStorage.setItem('username', response.user.username); // อัปเดต localStorage
            },
            error: function(error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            }
        });
    });
});
