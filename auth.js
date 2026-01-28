// Authentication System for DJEsocials

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Initialize users storage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
}

// Signup Handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (username.length < 3) {
        showError('Username must be at least 3 characters long');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if email already exists
    if (users[email]) {
        showError('Email already registered. Please sign in.');
        return;
    }
    
    // Check if username is taken
    const usernameTaken = Object.values(users).some(user => user.username === username);
    if (usernameTaken) {
        showError('Username already taken. Please choose another.');
        return;
    }
    
    // Create new user
    users[email] = {
        username: username,
        password: password,
        email: email,
        createdAt: new Date().toISOString(),
        friends: [],
        posts: [],
        friendRequests: []
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    showSuccess('Account created successfully! Redirecting...');
    
    // Auto login
    setTimeout(() => {
        localStorage.setItem('currentUser', email);
        window.location.href = 'home.html';
    }, 1500);
});

// Login Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (!users[email]) {
        showError('Email not found. Please sign up.');
        return;
    }
    
    if (users[email].password !== password) {
        showError('Incorrect password. Please try again.');
        return;
    }
    
    // Login successful
    localStorage.setItem('currentUser', email);
    window.location.href = 'home.html';
});

// Check if already logged in
if (localStorage.getItem('currentUser')) {
    window.location.href = 'home.html';
}
