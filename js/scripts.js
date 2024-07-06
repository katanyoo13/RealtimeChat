$(document).ready(function() {
    // Login form submission
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
                console.log('Login response:', response); // เพิ่มการตรวจสอบ
                if (response.success) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('role', response.role);
                    if (response.role === 'admin') {
                        window.location.href = 'dashboard.html';
                    } else if (response.role === 'user') {
                        window.location.href = 'chat.html';$(document).ready(function() {
                            let selectedUser = null;
                        
                            // Function to append user to the list
                            function appendUser(user) {
                                const userElement = $('<a>').addClass('list-group-item list-group-item-action bg-dark text-white').text(user.username);
                                userElement.click(function() {
                                    selectedUser = user;
                                    $('#chatHeader').text(`Chat with ${user.username}`);
                                    loadMessages(user._id);
                                });
                                $('#userList').append(userElement);
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
                        });
                        
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
