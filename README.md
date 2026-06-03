 TableServe 🍽️

An AI-powered restaurant order management system that streamlines communication between waiters and kitchen staff in real time.

## Features

- 🔐 JWT Authentication with role-based access (Waiter / Kitchen / Admin)
- 📋 Waiter can create orders, track active orders by table
- 👨‍🍳 Kitchen dashboard with live order updates
- ✅ Item-level status tracking (pending → preparing → done)
- 🤖 AI Menu Assistant powered by Gemini AI *(in progress)*
- ⚡ Real-time updates with Socket.io *(in progress)*
- 📊 Admin panel for menu and staff management *(in progress)*

## Tech Stack

**Frontend:** React, Axios, React Router

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas, Mongoose

**Auth:** JWT, bcrypt

**Real-time:** Socket.io *(in progress)*

**AI:** Google Gemini API *(in progress)*

## Project Structure

```
TableServeApp/
├── client/          # React frontend
│   └── src/
│       ├── pages/   # Login, Waiter, Kitchen, Admin
│       └── components/
└── server/          # Node.js backend
    ├── controllers/
    ├── models/
    ├── routes/
    └── middleware/
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repo
```bash
git clone https://github.com/saipradeeptlk-a11y/tableServe.git
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
```

4. Create `.env` in server folder
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
```

5. Run backend
```bash
cd server
nodemon index.js
```

6. Run frontend
```bash
cd client
npm start
```

## API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | - | Register user |
| POST | /api/auth/login | - | Login |
| GET | /api/menu | All | Get menu items |
| POST | /api/menu | Admin | Add menu item |
| PUT | /api/menu/:id | Admin | Update menu item |
| DELETE | /api/menu/:id | Admin | Delete menu item |
| POST | /api/orders | Waiter | Create order |
| GET | /api/orders | Kitchen | Get all orders |
| PUT | /api/orders/:id/status | Kitchen | Update order status |
| GET | /api/orders/table/:tableNumber | Waiter | Get orders by table |
| PUT | /api/orders/:orderId/items/:itemId/status | Kitchen | Update item status |
| PUT | /api/orders/:orderId/items/:itemId/quantity | Waiter | Update item quantity |

## Status

🚧 In Progress — Core system complete, real-time and AI features coming soon

## Author

Built by Sai Pradeep Thiagarajan(https://github.com/saipradeeptlk-a11y)
```

git commit -m "add README"
git push
```
