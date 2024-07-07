$(document).ready(function() {
    let selectedUser = null;
    let currentUser = null;

    // Get username from localStorage and set it in the dropdown
    const username = localStorage.getItem('username');
    if (username) {
        $('#userMenu').text(username); // Display the logged-in username
    }

    // Fetch current user profile picture and set currentUser
    $.ajax({
        type: 'GET',
        url: '/api/currentUser',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        success: function(user) {
            currentUser = user;
            const profileImagePath = user.profilePicture ? `uploads/${user.profilePicture}` : 'uploads/default.png';
            $('#userProfileImage').attr('src', profileImagePath);

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
                users.forEach(user => {
                    if (user._id !== currentUser._id) { // Avoid showing the current user
                        appendUser(user);
                    }
                });
            },
            error: function(error) {
                console.error('Error fetching users:', error);
            }
        });
    }

    // Function to append user to the list
    function appendUser(user) {
        const profileImagePath = user.profilePicture ? `uploads/${user.profilePicture}` : 'uploads/default.png';
        const userElement = $('<a>').addClass('list-group-item list-group-item-action bg-dark text-white d-flex align-items-center')
            .text(user.username);
        const profileImage = $('<img>').addClass('rounded-circle me-2').attr('src', profileImagePath).css({
            width: '40px',
            height: '40px',
            objectFit: 'cover'
        });
        userElement.prepend(profileImage);

        userElement.click(function() {
            selectedUser = user;
            $('#chatHeader').text(`Chat with ${user.username}`);
            loadMessages(user._id);
            $('#userModal').modal('hide');
        });

        $('#userList').append(userElement);
        $('#modalUserList').append(userElement.clone(true)); // Append to modal list
    }

    // Function to load messages for the selected user
    function loadMessages(userId) {
        // Clear current messages
        $('#messages').empty();

        // Fetch messages from API
        $.ajax({
            type: 'GET',
            url: `/api/messages/${currentUser._id}/${userId}`,
            success: function(messages) {
                messages.forEach(msg => appendMessage(msg));
            },
            error: function(error) {
                console.error('Error fetching messages:', error);
            }
        });
    }

    // Function to append message
    function appendMessage(message) {
        const messageElement = $('<div>').addClass('message').addClass(message.sender === currentUser._id ? 'sent' : 'received').text(message.message);
        $('#messages').append(messageElement);
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }

    // Send message on button click
    $('#sendMessageButton').click(function() {
        sendMessage();
    });

    // Send message on Enter key press
    $('#messageInput').keypress(function(e) {
        if (e.which === 13) {
            sendMessage();
        }
    });

    // Function to send a message
    function sendMessage() {
        const messageText = $('#messageInput').val();
        if (messageText.trim() !== '') {
            const message = {
                sender: currentUser._id,
                receiver: selectedUser._id,
                message: messageText
            };

            $.ajax({
                type: 'POST',
                url: '/api/messages',
                data: JSON.stringify(message),
                contentType: 'application/json',
                success: function(savedMessage) {
                    appendMessage(savedMessage);
                    $('#messageInput').val('');
                },
                error: function(error) {
                    console.error('Error sending message:', error);
                }
            });
        }
    }

    // Logout function
    $('#logoutButton').click(function() {
        // Clear local storage and redirect to login page
        localStorage.clear();
        window.location.href = 'login.html';
    });
});
