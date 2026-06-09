require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const menuRoutes = require('./routes/menu')
const orderRoutes = require('./routes/order')
const tableRoutues = require('./routes/Table')
const aiRoutes = require('./routes/ai')

const http = require('http')

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: 'http://localhost:3000' } })

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room)
  })
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use('/api/orders', (req, res, next) => {
  req.io = io
  next()
}, orderRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB')).catch((err) => console.log('Connection failed', err));
app.get("/", (req, res) => {
  res.json({ message: "TableServe API running" });
});
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/table', tableRoutues);
app.use('/api/ai', aiRoutes)




