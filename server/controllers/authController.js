const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const registerController = async (req,res)=>{
    try{
    const {name,email,password,role} = req.body;
    if(!name || !email || !password || !role){
        return res.status(400).json({
            message:"Pls provide all the fields"
        })
    };
    const trimedName = name.trim();
    if(!(validator.isEmail(email))){
        return res.status(400).json({
            message:"Pls provide a valid email"
        })
    }
    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password))){
        return res.status(400).json({
            message:"Pls provide a valid password"
        })
    }
    const hashed = await bcrypt.hash(password,10);
    await User.create({
        name:trimedName,
        email,
        password:hashed,
        role
    })
    return res.status(201).json({
        message:"User created successfully"
    });
}catch(err){
    console.log(err);
    return res.status(500).json({
        message: err.message
    })




}   
}

const loginController = async (req,res)=>{
    try{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"pls provide email and password"
        })
    }
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }
    const token = jwt.sign(
        { id:user._id,role:user.role },
        process.env.JWT_SECRET,
        { expiresIn: "10d"}
    )
    return res.status(200).json({
        token,
        role: user.role
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: err.message
        })
    }




}
module.exports = { registerController, loginController }
