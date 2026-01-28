// Home Page Functionality for DJEsocials

// Check authentication
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    window.location.href = 'index.html';
}

const users = JSON.parse(localStorage.getItem('users'));
const userData = users[currentUser];

// Initialize posts if not exists
if (!localStorage.getItem('allPosts')) {
    localStorage.setItem('allPosts', JSON.stringify([]));
}

// Display user information
function displayUserInfo() {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    userName.textContent = userData.username;
    userEmail.textContent = userData.email;
    userAvatar.textContent = userData.username.charAt(0).toUpperCase();
    
    // Update stats
    document.getElementById('friendCount').textContent = userData.friends.length;
    document.getElementById('postCount').textContent = userData.posts.length;
}

// Character counter for post
const postContent = document.getElementById('postContent');
const charCount = document.getElementById('charCount');

postContent.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length}/500`;
    
    if (length > 500) {
        charCount.style.color = '#ef4444';
    } else {
        charCount.style.color = 'var(--text-muted)';
    }
});

// Create a new post
function createPost() {
    const content = postContent.value.trim();
    
    if (!content) {
        alert('Post cannot be empty!');
        return;
    }
    
    if (content.length > 500) {
        alert('Post is too long! Maximum 500 characters.');
        return;
    }
    
    // Get all posts
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    
    // Create new post
    const newPost = {
        id: Date.now().toString(),
        author: userData.username,
        authorEmail: currentUser,
        content: content,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
    };
    
    // Add to all posts
    allPosts.unshift(newPost);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    
    // Add to user's posts
    userData.posts.unshift(newPost.id);
    users[currentUser] = userData;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear input
    postContent.value = '';
    charCount.textContent = '0/500';
    
    // Refresh feed
    loadPosts();
    
    // Update post count
    document.getElementById('postCount').textContent = userData.posts.length;
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

// Toggle like on a post
function toggleLike(postId) {
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) return;
    
    const likeIndex = post.likes.indexOf(currentUser);
    
    if (likeIndex > -1) {
        // Unlike
        post.likes.splice(likeIndex, 1);
    } else {
        // Like
        post.likes.push(currentUser);
    }
    
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    
    // Update UI
    const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
    const likeCount = likeBtn.querySelector('.like-count');
    
    likeCount.textContent = post.likes.length;
    
    if (post.likes.includes(currentUser)) {
        likeBtn.classList.add('liked');
    } else {
        likeBtn.classList.remove('liked');
    }
}

// Toggle comments section
function toggleComments(postId) {
    const commentsSection = document.querySelector(`[data-post-id="${postId}"] .comments-section`);
    commentsSection.classList.toggle('active');
}

// Add a comment
function addComment(postId) {
    const commentInput = document.querySelector(`[data-post-id="${postId}"] .comment-input input`);
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        alert('Comment cannot be empty!');
        return;
    }
    
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) return;
    
    const newComment = {
        id: Date.now().toString(),
        author: userData.username,
        authorEmail: currentUser,
        text: commentText,
        timestamp: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    
    // Clear input
    commentInput.value = '';
    
    // Reload comments
    loadComments(postId);
    
    // Update comment count
    const commentBtn = document.querySelector(`[data-post-id="${postId}"] .comment-btn`);
    const commentCount = commentBtn.querySelector('.comment-count');
    commentCount.textContent = post.comments.length;
}

// Load comments for a post
function loadComments(postId) {
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const post = allPosts.find(p => p.id === postId);
    
    if (!post) return;
    
    const commentsList = document.querySelector(`[data-post-id="${postId}"] .comments-list`);
    
    if (post.comments.length === 0) {
        commentsList.innerHTML = '<div class="comment-item">No comments yet. Be the first to comment!</div>';
        return;
    }
    
    commentsList.innerHTML = post.comments.map(comment => `
        <div class="comment-item">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `).join('');
}

// Load all posts
function loadPosts() {
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const postsFeed = document.getElementById('postsFeed');
    
    if (allPosts.length === 0) {
        postsFeed.innerHTML = `
            <div class="post-card" style="text-align: center; padding: 40px;">
                <h3 style="margin-bottom: 10px;">No posts yet</h3>
                <p style="color: var(--text-muted);">Be the first to share something!</p>
            </div>
        `;
        return;
    }
    
    postsFeed.innerHTML = allPosts.map(post => {
        const isLiked = post.likes.includes(currentUser);
        const avatar = post.author.charAt(0).toUpperCase();
        
        return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">${avatar}</div>
                    <div class="post-user-info">
                        <div class="post-username">${post.author}</div>
                        <div class="post-timestamp">${formatTimestamp(post.timestamp)}</div>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                        <span>❤️</span>
                        <span class="like-count">${post.likes.length}</span>
                    </button>
                    <button class="action-btn comment-btn" onclick="toggleComments('${post.id}')">
                        <span>💬</span>
                        <span class="comment-count">${post.comments.length}</span>
                    </button>
                </div>
                <div class="comments-section">
                    <div class="comment-input">
                        <input type="text" placeholder="Write a comment..." onkeypress="if(event.key === 'Enter') addComment('${post.id}')">
                        <button class="comment-btn" onclick="addComment('${post.id}')">Post</button>
                    </div>
                    <div class="comments-list">
                        <!-- Comments will be loaded here -->
                    </div>
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
displayUserInfo();
loadPosts();
