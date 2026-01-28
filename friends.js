// Friends Page Functionality for DJEsocials

// Check authentication
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

const users = JSON.parse(localStorage.getItem('users'));
const userData = users[currentUser];

// Search for users
function searchUsers() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();
    const searchResults = document.getElementById('searchResults');
    
    if (!searchTerm) {
        searchResults.innerHTML = '';
        return;
    }
    
    // Find matching users
    const matchingUsers = Object.values(users).filter(user => 
        user.username.toLowerCase().includes(searchTerm) && 
        user.email !== currentUser
    );
    
    if (matchingUsers.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-state">
                <h3>No users found</h3>
                <p>Try searching for a different username</p>
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = matchingUsers.map(user => {
        const isFriend = userData.friends.includes(user.email);
        const avatar = user.username.charAt(0).toUpperCase();
        
        return `
            <div class="friend-card" style="margin-top: 15px;">
                <div class="friend-info">
                    <div class="friend-avatar">${avatar}</div>
                    <div class="friend-details">
                        <div class="friend-username">${user.username}</div>
                        <div class="friend-email">${user.email}</div>
                    </div>
                </div>
                <div class="friend-actions">
                    ${isFriend 
                        ? `<button class="remove-btn" onclick="removeFriend('${user.email}')">Remove</button>
                           <button class="message-btn" onclick="goToMessages('${user.email}')">Message</button>`
                        : `<button class="add-btn" onclick="addFriend('${user.email}')">Add Friend</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Add a friend
function addFriend(friendEmail) {
    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUserData = updatedUsers[currentUser];
    
    if (!updatedUserData.friends.includes(friendEmail)) {
        updatedUserData.friends.push(friendEmail);
        
        // Also add current user to friend's friend list (mutual friendship)
        updatedUsers[friendEmail].friends.push(currentUser);
        
        // Update localStorage
        updatedUsers[currentUser] = updatedUserData;
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Refresh displays
        searchUsers();
        loadFriends();
        
        alert(`Added ${updatedUsers[friendEmail].username} as a friend!`);
    }
}

// Remove a friend
function removeFriend(friendEmail) {
    if (!confirm('Are you sure you want to remove this friend?')) {
        return;
    }
    
    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUserData = updatedUsers[currentUser];
    
    // Remove from current user's friends
    const friendIndex = updatedUserData.friends.indexOf(friendEmail);
    if (friendIndex > -1) {
        updatedUserData.friends.splice(friendIndex, 1);
    }
    
    // Remove current user from friend's friend list
    const friendUserData = updatedUsers[friendEmail];
    const currentUserIndex = friendUserData.friends.indexOf(currentUser);
    if (currentUserIndex > -1) {
        friendUserData.friends.splice(currentUserIndex, 1);
    }
    
    // Update localStorage
    updatedUsers[currentUser] = updatedUserData;
    updatedUsers[friendEmail] = friendUserData;
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Refresh displays
    searchUsers();
    loadFriends();
    
    alert(`Removed ${friendUserData.username} from friends.`);
}

// Go to messages with a specific user
function goToMessages(friendEmail) {
    localStorage.setItem('openChatWith', friendEmail);
    window.location.href = 'messages.html';
}

// Load friends list
function loadFriends() {
    const updatedUsers = JSON.parse(localStorage.getItem('users'));
    const updatedUserData = updatedUsers[currentUser];
    const friendsList = document.getElementById('friendsList');
    const friendsCount = document.getElementById('friendsCount');
    
    friendsCount.textContent = updatedUserData.friends.length;
    
    if (updatedUserData.friends.length === 0) {
        friendsList.innerHTML = `
            <div class="empty-state">
                <h3>No friends yet</h3>
                <p>Search for users above to add friends!</p>
            </div>
        `;
        return;
    }
    
    friendsList.innerHTML = updatedUserData.friends.map(friendEmail => {
        const friend = updatedUsers[friendEmail];
        if (!friend) return '';
        
        const avatar = friend.username.charAt(0).toUpperCase();
        
        return `
            <div class="friend-card">
                <div class="friend-info">
                    <div class="friend-avatar">${avatar}</div>
                    <div class="friend-details">
                        <div class="friend-username">${friend.username}</div>
                        <div class="friend-email">${friend.email}</div>
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="message-btn" onclick="goToMessages('${friendEmail}')">Message</button>
                    <button class="remove-btn" onclick="removeFriend('${friendEmail}')">Remove</button>
                </div>
            </div>
        `;
    }).join('');
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Initialize
loadFriends();
