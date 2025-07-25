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
