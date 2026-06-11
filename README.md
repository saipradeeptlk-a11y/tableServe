# 🍽️ TableServe — AI-Powered Restaurant Order Management System

A full-stack restaurant management system with real-time order tracking, role-based access, and an AI-powered menu assistant.

**🔗 Live Demo:** [https://snazzy-lamington-70183a.netlify.app](https://snazzy-lamington-70183a.netlify.app)

---

## 🚀 Features

- **Role-based access** — Admin, Waiter, and Kitchen staff roles
- **Real-time updates** — Socket.io powered live order notifications
- **AI Menu Assistant** — Groq AI chatbot to help customers with menu queries
- **Order Management** — Full order lifecycle from placement to completion
- **Table Management** — Track table status and assignments
- **Staff Management** — Admin can create and manage staff accounts

---

## 🧪 Test Credentials

| Role  | Email             | Password    |
|-------|-------------------|-------------|
| Admin | admin@gmail.com   | Admin@1234  |

> Staff accounts can be created via the Admin panel → Staff tab.

---

## 📸 Pages Overview

### 🔐 Login Page
- All users log in from a single login page
- Role-based routing redirects to the correct dashboard after login

### 👨‍🍳 Waiter Page
- View and filter menu by category
- Search menu items
- Select a table and build an order
- Submit orders to the kitchen in real-time
- AI assistant to answer menu-related questions

### 🍳 Kitchen Page
- View all incoming orders in real-time
- Mark individual items as completed
- Orders update live via Socket.io

### ⚙️ Admin Page
- **Orders tab** — View all orders across all tables
- **Menu tab** — Add, edit, and delete menu items
- **Staff tab** — Create and manage waiter/kitchen accounts
- **Tables tab** — Add tables and manage table status

### 🛠️ Setup Page (`/setup`)
- First-time setup to create the initial admin account
- Only works if no admin exists in the database

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Tailwind CSS, Axios     |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas                     |
| Realtime  | Socket.io                         |
| AI        | Groq AI API                       |
| Auth      | JWT + bcryptjs                    |

---

## 🏃 Run Locally

### Prerequisites
- Node.js
- MongoDB Atlas account
- Groq API key

### 1. Clone the repo
```bash
git clone https://github.com/saipradeeptlk-a11y/tableServe.git
cd tableServe
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

### 4. First Time Setup
Visit `http://localhost:3000/setup` to create your admin account.

---

## 📁 Project Structure

```
tableServe/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Login, WaiterPage, KitchenPage, AdminPage
│   │   ├── components/     # Admin sub-components
│   │   └── socket.js       # Socket.io client config
└── server/                 # Node.js backend
    ├── controllers/        # Route logic
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routes
    └── index.js            # Entry point
```

---

## 👨‍💻 Author

**Sai Pradeep** — [GitHub](https://github.com/saipradeeptlk-a11y)