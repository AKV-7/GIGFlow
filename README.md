# 🎮 GigFlow - Freelance Marketplace Platform

A modern freelance marketplace where Clients post jobs (Gigs) and Freelancers apply (Bids). Built with the MERN stack featuring real-time notifications, atomic transactions, and a brutalist Tetris-inspired UI.

![GigFlow Banner](https://img.shields.io/badge/GigFlow-Freelance%20Marketplace-orange?style=for-the-badge)

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication** - JWT with HttpOnly cookies
- 👥 **Fluid User Roles** - Any user can post gigs or bid on jobs
- 📝 **Gig Management** - Create, browse, and search job postings
- 💰 **Bidding System** - Submit proposals with custom pricing
- ✅ **Smart Hiring** - One-click hire with automatic bid status updates

### Advanced Features
- 🔍 **Real-time Search** - Debounced search filtering by title
- ⚡ **Atomic Transactions** - Race-condition safe hiring logic
- 🔔 **Socket.io Notifications** - Instant "You're hired!" alerts
- 🎨 **Brutalist UI** - Tetris-inspired design with gaming aesthetics

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js (Vite), Tailwind CSS, Redux Toolkit |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **Auth** | JWT, bcrypt |

## 📁 Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & Socket.io config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   └── app.js          # Express app setup
│   ├── server.js           # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Socket.io context
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Redux store & slices
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gigflow.git
cd gigflow
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Create `.env` file in backend/**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

5. **Run the Application**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

6. **Open in Browser**
```
http://localhost:5173
```

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & receive token | Public |
| GET | `/api/gigs?search=` | Get all open gigs | Public |
| POST | `/api/gigs` | Create a new gig | 🔒 Protected |
| POST | `/api/bids` | Submit a bid | 🔒 Protected |
| GET | `/api/bids/:gigId` | Get bids for a gig (owner only) | 🔒 Protected |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer | 🔒 Protected |

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: 'open' | 'assigned'
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  proposedPrice: Number,
  status: 'pending' | 'hired' | 'rejected'
}
```

## 🎯 Hiring Logic (Atomic)

When a client clicks **"Hire"** on a bid:

1. ✅ Gig status changes from `open` → `assigned`
2. ✅ Selected bid status changes to `hired`
3. ✅ All other bids automatically marked as `rejected`
4. ✅ Freelancer receives real-time notification

**Race Condition Prevention:**
Uses `findOneAndUpdate` with status condition to ensure only one hire succeeds if multiple users click simultaneously.

## 🔔 Real-time Notifications

Socket.io events:
- `hired` - Sent to freelancer when hired
- `new_bid` - Sent to gig owner when new bid received

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User 1 | flow@test.com | password123 |
| User 2 | freelancer@test.com | password123 |

## 📸 Screenshots

### Home Page with Search
![Home Page](./screenshots/home.png)

### Gig Detail with Bids
![Gig Detail](./screenshots/gig-detail.png)

### Hiring Success
![Hiring](./screenshots/hiring.png)

## 🏆 Bonus Features Implemented

- [x] **Bonus 1**: Atomic transaction-safe hiring logic
- [x] **Bonus 2**: Socket.io real-time notifications



