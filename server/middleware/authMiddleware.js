const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const loginMiddleware = (req,res,next)=>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message:"The token is missing"
        })
    }
    const actualToken = token.split(' ')[1];
    try{
        const decoded = jwt.verify(actualToken,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}
const rolechecker = (role) =>{
    return (req,res,next)=>{
        if(req.user.role !== role){
            return res.status(403).json({
                message:"You are not authorized to access this resource"
            })
        }        next();
    }
}
module.exports = { loginMiddleware,rolechecker}