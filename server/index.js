require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose') 
const cors = require('cors')    
const authRoutes = require('./routes/auth')     
const menuRoutes = require('./routes/menu')
const orderRoutes = require('./routes/order')


app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(()=> console.log('Connected to MongoDB')).catch((err)=>console.log('Connection failed',err));
app.get("/",(req,res)=>{
    res.json({message : "TableServe API running"});
});
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


