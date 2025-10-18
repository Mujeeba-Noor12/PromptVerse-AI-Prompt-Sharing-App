# MongoDB Setup Guide

## Option 1: Install MongoDB Locally

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

### macOS:
```bash
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

## Option 2: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/promptverse
   ```

## Option 3: Quick Test (Docker)

If you have Docker installed:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verify Installation

After installing MongoDB, restart your server:
```bash
npm start
```

You should see: "Connected to MongoDB"

## Troubleshooting

- Make sure MongoDB is running on port 27017
- Check if the MongoDB service is started
- Verify your connection string in `.env` file
- Try using MongoDB Atlas for easier setup 