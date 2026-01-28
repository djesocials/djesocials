# DJEsocials - Social Media Platform

A complete social media platform built with HTML, CSS, and JavaScript featuring user authentication, posts, likes, comments, friend management, and real-time messaging.

## Features

✨ **User Authentication**
- Sign up with username, email, and password
- Secure login system
- Remember user sessions

📝 **Social Feed**
- Create posts (up to 500 characters)
- Like and comment on posts
- View posts from all users
- Delete your own posts

👥 **Friend System**
- Search for users by username
- Add/remove friends
- View friend list
- Mutual friendship system

💬 **Messaging**
- Real-time chat with friends
- Conversation history
- Message timestamps
- Clean chat interface

👤 **User Profile**
- View your stats (posts, friends, likes, comments)
- Account information
- Post history
- Delete account option

## Design Features

🎨 **Dark Purple/Grey Theme**
- Modern gradient backgrounds
- Smooth animations throughout
- Floating background shapes
- Glassmorphism effects
- Responsive design

## How to Use on Google Sites

### Method 1: Embed HTML (Recommended)

1. **Upload Files to a Web Host**
   - Upload all HTML, CSS, and JS files to a web hosting service (GitHub Pages, Netlify, Vercel, etc.)
   - Get the public URL for your `index.html` file

2. **Embed in Google Sites**
   - Open your Google Site
   - Click "Insert" > "Embed"
   - Paste your hosted URL
   - Adjust the embed size as needed

### Method 2: Direct Embedding (Limited)

1. **Create Custom HTML Pages**
   - In Google Sites, you can embed individual HTML snippets
   - Go to Insert > Embed > Embed code
   - Paste the HTML content
   - Note: This method has limitations with file loading

### Method 3: Host Externally and Link

1. **Host Your Site**
   - Use GitHub Pages (free): 
     - Create a GitHub repository
     - Upload all files
     - Enable GitHub Pages in settings
   - Or use Netlify/Vercel for one-click deployment

2. **Link from Google Sites**
   - Add a button or link on your Google Site
   - Point it to your hosted DJEsocials URL

## File Structure

```
DJEsocials/
├── index.html          # Login/Signup page
├── home.html           # Main feed
├── friends.html        # Friends management
├── messages.html       # Chat interface
├── profile.html        # User profile
├── styles.css          # Shared styles
├── auth.js            # Authentication logic
├── home.js            # Feed functionality
├── friends.js         # Friend management
├── messages.js        # Messaging system
└── profile.js         # Profile functionality
```

## Features Explained

### Authentication System
- Uses localStorage to store user data
- Password validation (minimum 6 characters)
- Username validation (minimum 3 characters)
- Unique email and username enforcement
- Automatic login after signup

### Post System
- Character limit with live counter
- Timestamps (shows "just now", "5 minutes ago", etc.)
- Like/unlike functionality
- Comment system with nested replies
- Delete own posts

### Friend System
- Search users by username
- Add/remove friends
- Mutual friendship (both users become friends)
- Direct message from friend list
- Friend counter

### Messaging
- One-on-one conversations
- Persistent message history
- Real-time updates (on page refresh)
- Timestamp for each message
- Conversation preview in sidebar

### Profile Page
- Account statistics
- Member since date
- Total likes and comments received
- Recent posts display
- Account deletion (with confirmation)

## Data Storage

All data is stored in browser localStorage:
- `users` - All user accounts and data
- `allPosts` - All posts from all users
- `conversations` - All chat messages
- `currentUser` - Currently logged-in user

## Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --dark-purple: #1a0a2e;
    --accent-purple: #7b3ff2;
    /* etc. */
}
```

### Modify Animations
All animations are defined in CSS with `@keyframes`. Look for:
- `slideUp`, `slideDown`, `fadeIn`
- `float`, `pulse`, `glow`
- Adjust timing and effects as needed

### Add Features
Each page has its own JS file where you can add:
- New post types
- File uploads
- Emoji support
- Profile pictures
- And more!

## Browser Compatibility

✅ Chrome, Edge, Firefox, Safari (latest versions)
✅ Mobile responsive
✅ Works offline (after initial load)

## Limitations

⚠️ **Important Notes:**
- All data is stored locally in the browser
- Data is not shared between devices
- Clearing browser data will erase all content
- Not suitable for production without a backend
- For demo/prototype purposes

## Security Note

This is a **demonstration project** using localStorage. For a real social media platform, you would need:
- Backend server (Node.js, Python, PHP, etc.)
- Real database (MySQL, MongoDB, etc.)
- Proper authentication (OAuth, JWT)
- Password encryption
- API endpoints
- Security measures

## Credits

Created for educational and demonstration purposes.
Design inspired by modern social media platforms with a custom dark purple theme.

---

**Enjoy using DJEsocials! 🚀**

For issues or questions, feel free to modify and extend the code as needed.
