$(document).ready(function() {
    let selectedUser = null;

    // Get username from localStorage and set it in the dropdown
    const username = localStorage.getItem('username');
    if (username) {
        $('#userMenu').text(username); // แสดงชื่อผู้ใช้ในปุ่ม Dropdown
    }

    // Function to append user to the list
    function appendUser(user) {
        const userElement = $('<a>').addClass('list-group-item list-group-item-action bg-dark text-white').text(user.username);
        userElement.click(function() {
            selectedUser = user;
            $('#chatHeader').text(`Chat with ${user.username}`);
            loadMessages(user._id);
            $('#userModal').modal('hide');
        });
        $('#userList').append(userElement);
        $('#modalUserList').append(userElement.clone(true)); // Append to modal list
    }

    // Fetch users from API and append to the list
    $.ajax({
        type: 'GET',
        url: '/api/users',
        success: function(users) {
            console.log('Fetched users:', users); // เพิ่มการตรวจสอบ
            users.forEach(user => appendUser(user));
        },
        error: function(error) {
            console.error('Error fetching users:', error);
        }
    });

    // Function to load messages for the selected user
    function loadMessages(userId) {
        // Clear current messages
        $('#messages').empty();
        
        // Fetch messages from API (dummy implementation)
        const messages = [
            { sender: 'you', text: 'Hello!', type: 'sent' },
            { sender: 'friend', text: 'Hi there!', type: 'received' }
        ];

        // Append messages
        messages.forEach(msg => appendMessage(msg));
    }

    // Function to append message
    function appendMessage(message) {
        const messageElement = $('<div>').addClass('message').addClass(message.type).text(message.text);
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
            const message = { sender: 'you', text: messageText, type: 'sent' };
            appendMessage(message);
            $('#messageInput').val('');

            // Here you would send the message to the server and to the selected user
            console.log('Sending message to', selectedUser.username, ':', messageText);
        }
    }

    // Logout function
    $('#logoutButton').click(function() {
        // Clear local storage and redirect to login page
        localStorage.clear();
        window.location.href = 'login.html';
    });
});
