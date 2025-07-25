# PromptVerse - AI Prompt Sharing Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application that allows users to create, share, and discover high-quality AI prompts for tools like ChatGPT and Midjourney.

## 🚀 Features

### 🔐 Authentication & User Management
- **JWT Authentication**: Secure login/register with password hashing using bcrypt
- **User Profiles**: Public profiles with user stats and prompt collections
- **Profile Management**: Edit username, bio, and account settings

### ✍️ Prompt Management
- **Create Prompts**: Rich text editor with tags, categories, and visibility settings
- **Edit/Delete**: Full CRUD operations for user's own prompts
- **Public/Private**: Choose visibility for each prompt
- **Categories**: Support for ChatGPT, Midjourney, DALL-E, Bard, Claude, and more

### 🔍 Search & Discovery
- **Live Search**: Real-time search across prompts, tags, and authors
- **Advanced Filtering**: Filter by category, tags, and author
- **Sorting Options**: Sort by latest, most viewed, most used, or most liked
- **Pagination**: Efficient loading with pagination support

### 💡 Interactive Features
- **Like System**: Like/unlike prompts with real-time updates
- **Usage Tracking**: Track how many times prompts are used
- **Copy to Clipboard**: One-click prompt copying
- **View Counts**: Track prompt popularity

### 📱 Responsive Design
- **Mobile-First**: Fully responsive design with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Frontend
- **React.js 18**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Tailwind CSS**: Utility-first CSS framework
- **React Icons**: Beautiful icon library
- **React Hot Toast**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing

### Development Tools
- **Nodemon**: Auto-restart server during development
- **Concurrently**: Run frontend and backend simultaneously

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd promptverse
```

### 2. Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/promptverse

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. Start the Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (optional),
  bio: String (optional),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Prompt Model
```javascript
{
  title: String (required),
  content: String (required),
  description: String (optional),
  tags: [String],
  category: String (enum),
  author: ObjectId (ref: User),
  likes: [ObjectId] (ref: User),
  views: Number,
  isPublic: Boolean,
  usageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Prompts
- `GET /api/prompts` - Get all prompts (with search/filter)
- `GET /api/prompts/:id` - Get specific prompt
- `POST /api/prompts` - Create new prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt
- `POST /api/prompts/:id/like` - Toggle like
- `POST /api/prompts/:id/use` - Increment usage count

### Users
- `GET /api/users/profile/:username` - Get public user profile
- `GET /api/users/me/prompts` - Get current user's prompts
- `GET /api/users/me/liked` - Get liked prompts
- `GET /api/users/search` - Search users
- `GET /api/users/top` - Get top users

## 🎨 UI Components

### Core Components
- **Navbar**: Responsive navigation with user menu
- **PromptCard**: Reusable prompt display component
- **SearchBar**: Debounced search functionality
- **FilterBar**: Category and sort filtering
- **PrivateRoute**: Authentication protection

### Pages
- **Home**: Landing page with search and filters
- **Login/Register**: Authentication forms
- **CreatePrompt**: Rich prompt creation form
- **PromptDetail**: Full prompt view with actions
- **Profile**: User account management
- **UserProfile**: Public user profiles
- **MyPrompts**: User's prompt management
- **LikedPrompts**: User's liked prompts

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git:
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
1. Build the React app:
```bash
cd client
npm run build
```
2. Deploy the `build` folder to your preferred platform

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Query for server state management
- MongoDB for the flexible database
- Express.js for the robust backend framework

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub or contact the development team.

---

**PromptVerse** - Share, discover, and use amazing AI prompts! 🚀 