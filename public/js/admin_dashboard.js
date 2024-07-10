$(document).ready(function() {
    let currentUser = null;

    // Get current user profile picture and set currentUser
    $.ajax({
        type: 'GET',
        url: '/api/currentUser',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(user) {
            currentUser = user;
            let profileImagePath = user.profilePicture ? `uploads/${user.profilePicture}` : 'uploads/default_admin.png';
            $('#adminProfileImage').attr('src', profileImagePath);

            // Fetch users only after we have the current user information
            fetchUsers();
        },
        error: function(error) {
            console.error('Error fetching current user:', error);
        }
    });

    // Function to fetch users from API and append to the list
    function fetchUsers() {
        $.ajax({
            type: 'GET',
            url: '/api/users',
            success: function(users) {
                console.log('Fetched users:', users); // Log the fetched users
                $('#userTableBody').empty(); // Clear the table body
                users.forEach(user => appendUser(user));
            },
            error: function(error) {
                console.error('Error fetching users:', error);
            }
        });
    }

    // Function to append user to the table
    function appendUser(user) {
        const userRow = `
            <tr>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.role || 'N/A'}</td>
                <td>
                    <button class="btn btn-primary btn-sm editUserBtn" data-id="${user._id}">Edit</button>
                    <button class="btn btn-danger btn-sm deleteUserBtn" data-id="${user._id}">Delete</button>
                </td>
            </tr>
        `;
        $('#userTableBody').append(userRow);
    }

    // Handle Edit User button click
    $(document).on('click', '.editUserBtn', function() {
        const userId = $(this).data('id');
        // Fetch and display user data in the modal
        $.ajax({
            type: 'GET',
            url: `/api/users/${userId}`,
            success: function(user) {
                $('#editUsername').val(user.username);
                $('#editEmail').val(user.email);
                $('#editRole').val(user.role);
                $('#editUserForm').data('id', user._id);
                $('#editUserModal').modal('show');
            },
            error: function(error) {
                console.error('Error fetching user:', error);
            }
        });
    });

    // Handle Delete User button click
    $(document).on('click', '.deleteUserBtn', function() {
        const userId = $(this).data('id');
        if (confirm('Are you sure you want to delete this user?')) {
            $.ajax({
                type: 'DELETE',
                url: `/api/users/${userId}`,
                success: function(response) {
                    fetchUsers(); // Refresh the user list
                },
                error: function(error) {
                    console.error('Error deleting user:', error);
                }
            });
        }
    });

    // Handle edit user form submission
    $('#editUserForm').submit(function(event) {
        event.preventDefault();
        const userId = $(this).data('id');
        const updatedUser = {
            username: $('#editUsername').val(),
            email: $('#editEmail').val(),
            role: $('#editRole').val()
        };

        $.ajax({
            type: 'PUT',
            url: `/api/users/${userId}`,
            data: JSON.stringify(updatedUser),
            contentType: 'application/json',
            success: function(response) {
                $('#editUserModal').modal('hide');
                fetchUsers(); // Refresh the user list
            },
            error: function(error) {
                console.error('Error updating user:', error);
            }
        });
    });

    $('#userManagementLink').click(function() {
        $('#pageHeader').text('User Management');
        $('#userManagementContent').show();
        $('#mainContent > div').not('#userManagementContent').hide();
    });

    $('#statisticsLink').click(function() {
        $('#pageHeader').text('Statistics/Reports');
        $('#userManagementContent').hide();
        // Add other content sections as needed
    });

    $('#settingsLink').click(function() {
        $('#pageHeader').text('Settings');
        $('#userManagementContent').hide();
        // Add other content sections as needed
    });

    // Logout function
    $('#logoutButton, #logoutButtonDropdown').click(function() {
        // Clear local storage and redirect to login page
        localStorage.clear();
        window.location.href = 'login.html';
    });
});
