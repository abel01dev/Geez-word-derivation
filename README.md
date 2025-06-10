# Geez Word Derivation

This project consists of a frontend React application and a backend Node.js server with MongoDB database.

## Prerequisites

Before running the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

## Setup Instructions

### 1. Install MongoDB
- Download and install MongoDB Community Edition from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- For Windows:
  - Install MongoDB as a service
  - The default port will be 27017
- For Mac/Linux:
  - Follow the installation instructions for your OS
  - Start MongoDB service: `sudo service mongod start`

### 2. Setup Backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

The backend server will run on http://localhost:5000

### 3. Setup Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on http://localhost:5173

## Configuration

If you need to change the MongoDB connection URL or API endpoints:

1. Backend (backend/server.js):
   - MongoDB URL: `mongodb://127.0.0.1:27017/geez-word-derivation`
   - Server Port: 5000

2. Frontend (frontend/src/components/WordHistory.jsx):
   - API_URL: Update it to match your backend URL (default: "http://localhost:5000")

## Common Issues

1. If MongoDB fails to connect:
   - Make sure MongoDB service is running
   - Check if the MongoDB port (27017) is not blocked
   - Verify MongoDB installation: `mongosh` in terminal

2. If frontend can't connect to backend:
   - Check if backend server is running
   - Verify API_URL in frontend matches backend URL
   - Check for CORS issues in browser console

## Project Structure

```
.
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── pages/        # Page components
│   └── package.json
│
└── backend/               # Node.js backend
    ├── models/           # MongoDB models
    ├── server.js         # Express server
    └── package.json
```

## Need Help?

If you encounter any issues:
1. Check if MongoDB is running: `mongosh` in terminal
2. Verify all dependencies are installed in both frontend and backend
3. Check console logs for error messages
4. Make sure ports 5000 and 27017 are available 