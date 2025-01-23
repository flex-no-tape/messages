// Function to load messages from the server
function loadMessages() {
    fetch('http://3.104.63.29:3000/messages')  // Change to your EC2 instance IP or domain
        .then(response => response.json())
        .then(messages => {
            const messageBoard = document.getElementById('message-board');
            messageBoard.innerHTML = '';  // Clear current messages
            messages.forEach(message => {
                const li = document.createElement('li');
                li.classList.add('message');
                li.textContent = message.content;
                messageBoard.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading messages:', error));
}

// Function to post a new message to the backend
function addMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (message) {
        fetch('http://3.104.63.29:3000/messages', {  // Change to your EC2 instance IP or domain
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to post message');
                return response.json();
            })
            .then(() => {
                messageInput.value = '';  // Clear input field
                loadMessages();  // Reload the messages after posting a new one
            })
            .catch(error => console.error('Error posting message:', error));
    } else {
        alert('Please type a message!');
    }
}
