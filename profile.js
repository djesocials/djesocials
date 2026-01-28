// Profile Page Functionality for DJEsocials

// Check authentication
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

const users = JSON.parse(localStorage.getItem('users'));
const userData = users[currentUser];

// Load profile information
function loadProfile() {
    // Basic info
    const profileAvatar = document.getElementById('profileAvatar');
    const profileUsername = document.getElementById('profileUsername');
    const profileEmail = document.getElementById('profileEmail');
    
    profileAvatar.textContent = userData.username.charAt(0).toUpperCase();
    profileUsername.textContent = userData.username;
    profileEmail.textContent = userData.email;
    
    // Stats
    document.getElementById('profilePostCount').textContent = userData.posts.length;
    document.getElementById('profileFriendCount').textContent = userData.friends.length;
    
    // Member since
    const memberSince = new Date(userData.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('memberSince').textContent = memberSince;
    
    // Calculate total likes and comments
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const userPosts = allPosts.filter(post => post.authorEmail === currentUser);
    
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
    
    document.getElementById('totalLikes').textContent = totalLikes;
    document.getElementById('totalComments').textContent = totalComments;
}

// Load user's posts
function loadMyPosts() {
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const myPostsSection = document.getElementById('myPostsSection');
    const userPosts = allPosts.filter(post => post.authorEmail === currentUser);
    
    if (userPosts.length === 0) {
        myPostsSection.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted);">
                <h3 style="color: var(--text-light); margin-bottom: 10px;">No posts yet</h3>
                <p>Start sharing your thoughts with the world!</p>
            </div>
        `;
        return;
    }
    
    myPostsSection.innerHTML = userPosts.slice(0, 5).map(post => {
        const avatar = userData.username.charAt(0).toUpperCase();
        const timestamp = formatTimestamp(post.timestamp);
        
        return `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-avatar">${avatar}</div>
                    <div class="post-user-info">
                        <div class="post-username">${userData.username}</div>
                        <div class="post-timestamp">${timestamp}</div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="action-btn" disabled>
                        <span>❤️</span>
                        <span>${post.likes.length}</span>
                    </button>
                    <button class="action-btn" disabled>
                        <span>💬</span>
                        <span>${post.comments.length}</span>
                    </button>
                    <button class="action-btn" onclick="deletePost('${post.id}')" style="margin-left: auto; border-color: rgba(239, 68, 68, 0.5); color: #fca5a5;">
                        <span>🗑️</span>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

// Delete a post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    
    // Remove from all posts
    let allPosts = JSON.parse(localStorage.getItem('allPosts'));
    allPosts = allPosts.filter(post => post.id !== postId);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    
    // Remove from user's posts
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];
    userData.posts = userData.posts.filter(id => id !== postId);
    users[currentUser] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload
    loadProfile();
    loadMyPosts();
    
    alert('Post deleted successfully!');
}

// Delete account
function deleteAccount() {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    
    if (confirmation !== 'DELETE') {
        alert('Account deletion cancelled.');
        return;
    }
    
    if (!confirm('Are you absolutely sure? This action cannot be undone!')) {
        return;
    }
    
    // Remove user from all friends' friend lists
    const users = JSON.parse(localStorage.getItem('users'));
    
    userData.friends.forEach(friendEmail => {
        if (users[friendEmail]) {
            const friendIndex = users[friendEmail].friends.indexOf(currentUser);
            if (friendIndex > -1) {
                users[friendEmail].friends.splice(friendIndex, 1);
            }
        }
    });
    
    // Remove user's posts from all posts
    let allPosts = JSON.parse(localStorage.getItem('allPosts'));
    allPosts = allPosts.filter(post => post.authorEmail !== currentUser);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    
    // Remove user's conversations
    const conversations = JSON.parse(localStorage.getItem('conversations'));
    Object.keys(conversations).forEach(key => {
        if (key.includes(currentUser)) {
            delete conversations[key];
        }
    });
    localStorage.setItem('conversations', JSON.stringify(conversations));
    
    // Delete user account
    delete users[currentUser];
    localStorage.setItem('users', JSON.stringify(users));
    
    // Logout
    localStorage.removeItem('currentUser');
    
    alert('Your account has been deleted. We\'re sorry to see you go!');
    window.location.href = 'index.html';
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Initialize
loadProfile();
loadMyPosts();
