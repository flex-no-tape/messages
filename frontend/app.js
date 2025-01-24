// When the page loads, check if dark mode is enabled in local storage
window.onload = function() {
    loadMessages();
    // Set the mode based on localStorage or default to light mode
    if (localStorage.getItem('mode') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('mode-toggle').innerText = 'Switch to Light Mode';
    } else {
        document.getElementById('mode-toggle').innerText = 'Switch to Sorta Dark Mode';
    }
};

// Toggle between dark mode and light mode
function toggleMode() {
    const body = document.body;
    const modeToggleButton = document.getElementById('mode-toggle');
    body.classList.toggle('dark-mode');

    // Save the mode in localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('mode', 'dark');
        modeToggleButton.innerText = 'Switch to Light Mode';
    } else {
        localStorage.setItem('mode', 'light');
        modeToggleButton.innerText = 'Switch to Sorta Dark Mode';
    }
}

// Function to load messages from the backend
function loadMessages() {
    fetch('http://3.25.189.169:3000/messages')
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
        fetch('http://3.25.189.169:3000/messages', {
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
