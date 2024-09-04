const sendBtn = document.querySelector('#send-btn');
const promptInput = document.querySelector('#prompt-input');
const responseText = document.querySelector('#response-text');

// Enable or disable the send button based on input value
promptInput.addEventListener('input', function(event) {
    sendBtn.disabled = event.target.value ? false : true;
});

// Function to send the user's message to the FastAPI backend and display the response
async function sendMessage() {
    const prompt = promptInput.value.trim(); // Get the prompt from input
    if (!prompt) {
        return;   
    }

    // Clear the input after sending
    promptInput.value = '';
    sendBtn.disabled = true;

    // Add user's message to the chatbox
    addMessageToChat('right', prompt);

    // Make a request to the FastAPI backend
    fetch('/query', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Add the bot's response to the chatbox
        addMessageToChat('left', data.response);
    })
    .catch(error => {
        console.error('Error:', error);
        addMessageToChat('left', 'Error: Failed to get a response.');
    });
}

// Function to add a message to the chatbox
function addMessageToChat(side, text) {
    // Create the new message list item
    const newMessage = document.createElement('li');
    newMessage.classList.add('message', side, 'appeared');

    // Create the avatar
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');

    // Create the text wrapper
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('text_wrapper');

    // Create the message text element
    const messageText = document.createElement('div');
    messageText.classList.add('text');
    messageText.textContent = text;

    // Append the text inside the text wrapper
    textWrapper.appendChild(messageText);

    // Add the avatar and the text wrapper to the message
    newMessage.appendChild(avatar);
    newMessage.appendChild(textWrapper);

    // Append the new message to the chatbox
    const responseText = document.getElementById('response-text');
    responseText.appendChild(newMessage);

    // Scroll to the bottom of the chatbox after adding the message
    responseText.scrollTop = responseText.scrollHeight;
}
// Send the message when Enter is pressed
promptInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Send the message when the send button is clicked
sendBtn.addEventListener('click', sendMessage);
