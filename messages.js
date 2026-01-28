// Messages Page Functionality for DJEsocials

// Check authentication
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

const users = JSON.parse(localStorage.getItem('users'));
const userData = users[currentUser];

let activeChat = null;

// Initialize conversations if not exists
if (!localStorage.getItem('conversations')) {
    localStorage.setItem('conversations', JSON.stringify({}));
}

// Get conversation key (alphabetically sorted to ensure consistency)
function getConversationKey(user1, user2) {
    return [user1, user2].sort().join('_');
}

// Load conversations list
function loadConversations() {
    const conversationsList = document.getElementById('conversationsList');
    
    if (userData.friends.length === 0) {
        conversationsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-muted);">
                <p>No friends to message</p>
                <p style="font-size: 13px; margin-top: 10px;">Add friends to start chatting!</p>
            </div>
        `;
        return;
    }
    
    const conversations = JSON.parse(localStorage.getItem('conversations'));
    
    conversationsList.innerHTML = userData.friends.map(friendEmail => {
        const friend = users[friendEmail];
        if (!friend) return '';
        
        const conversationKey = getConversationKey(currentUser, friendEmail);
        const messages = conversations[conversationKey] || [];
        const lastMessage = messages[messages.length - 1];
        
        const avatar = friend.username.charAt(0).toUpperCase();
        const isActive = activeChat === friendEmail;
        
        return `
            <div class="conversation-item ${isActive ? 'active' : ''}" onclick="openChat('${friendEmail}')">
                <div class="conversation-avatar">${avatar}</div>
                <div class="conversation-info">
                    <div class="conversation-name">${friend.username}</div>
                    <div class="conversation-preview">
                        ${lastMessage ? lastMessage.text.substring(0, 30) + '...' : 'Start a conversation'}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Open chat with a friend
function openChat(friendEmail) {
    activeChat = friendEmail;
    const friend = users[friendEmail];
    const chatArea = document.getElementById('chatArea');
    const avatar = friend.username.charAt(0).toUpperCase();
    
    chatArea.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-avatar">${avatar}</div>
            <div class="chat-header-info">
                <h3>${friend.username}</h3>
                <p>${friend.email}</p>
            </div>
        </div>
        <div class="messages-area" id="messagesArea"></div>
        <div class="message-input-area">
            <input type="text" id="messageInput" placeholder="Type a message..." onkeypress="if(event.key === 'Enter') sendMessage()">
            <button class="send-btn" onclick="sendMessage()">Send</button>
        </div>
    `;
    
    loadMessages();
    loadConversations();
    
    // Auto-focus input
    document.getElementById('messageInput').focus();
}

// Load messages for active chat
function loadMessages() {
    if (!activeChat) return;
    
    const messagesArea = document.getElementById('messagesArea');
    const conversationKey = getConversationKey(currentUser, activeChat);
    const conversations = JSON.parse(localStorage.getItem('conversations'));
    const messages = conversations[conversationKey] || [];
    
    if (messages.length === 0) {
        messagesArea.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); margin: auto;">
                <p>No messages yet</p>
                <p style="font-size: 13px; margin-top: 10px;">Send a message to start the conversation!</p>
            </div>
        `;
        return;
    }
    
    messagesArea.innerHTML = messages.map(message => {
        const isSent = message.sender === currentUser;
        const time = new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
        
        return `
            <div class="message-bubble ${isSent ? 'sent' : 'received'}">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

// Send a message
function sendMessage() {
    if (!activeChat) return;
    
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (!messageText) return;
    
    const conversationKey = getConversationKey(currentUser, activeChat);
    const conversations = JSON.parse(localStorage.getItem('conversations'));
    
    if (!conversations[conversationKey]) {
        conversations[conversationKey] = [];
    }
    
    const newMessage = {
        id: Date.now().toString(),
        sender: currentUser,
        receiver: activeChat,
        text: messageText,
        timestamp: new Date().toISOString()
    };
    
    conversations[conversationKey].push(newMessage);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    // Clear input
    messageInput.value = '';
    
    // Reload messages
    loadMessages();
    loadConversations();
}

// Check if there's a chat to open from friends page
const openChatWith = localStorage.getItem('openChatWith');
if (openChatWith) {
    localStorage.removeItem('openChatWith');
    openChat(openChatWith);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Initialize
loadConversations();
