# Apex Arena Gaming Platform

A full-stack gaming tournament platform built with React (frontend) and Node.js/Express (backend).

## 📁 Project Structure

```
apex-arena/
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and configurations
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
├── backend/                  # Node.js + Express API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   └── utils/           # Utility functions
│   ├── package.json         # Backend dependencies
│   └── .env                 # Environment variables
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies for both frontend and backend:
```bash
npm run install:all
```

2. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
   - Update the values with your actual configuration

### Running the Application

#### Development Mode (both frontend and backend)
```bash
npm run dev
```

#### Frontend Only
```bash
npm run dev:frontend
```
Frontend will be available at: http://localhost:5173

#### Backend Only
```bash
npm run dev:backend
```
Backend API will be available at: http://localhost:5000

### Production Build

```bash
# Build frontend
npm run build:frontend

# Start backend server
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/join` - Join team
- `POST /api/teams/:id/leave` - Leave team

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get tournament by ID
- `POST /api/tournaments` - Create new tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament
- `POST /api/tournaments/:id/join` - Join tournament

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/teams` - Get user teams
- `GET /api/users/tournaments` - Get user tournaments

## 🎮 Features

- **User Authentication**: Register, login, and profile management
- **Team Management**: Create, join, and manage gaming teams
- **Tournament System**: Create and participate in tournaments
- **Gaming Stats**: Track player statistics and rankings
- **Real-time Updates**: Live tournament updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Radix UI** - Component library
- **Supabase** - Database & Auth (alternative to backend)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Morgan** - HTTP request logger
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📝 Environment Variables

## 🧪 Testing

```bash
# Test frontend
npm run test:frontend

# Test backend
npm run test:backend

# Test both
npm test
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build:frontend`
2. Deploy the `frontend/dist` folder

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy the `backend` folder
3. Ensure the frontend API URL points to the deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
