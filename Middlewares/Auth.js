const jwt=require('jsonwebtoken')
const Errorhandler = require('../utils/ErrorHandler')
const userModel=require("../Models/user.model")

const protect=async (req,res,next)=>{
    try{
       const {token}=req.cookies
       if(!token){
        return next(new Errorhandler("Please Log in first to access this feature",401))
       }else{
        const decodedData=jwt.verify(token,process.env.JWT_SECRET)
        if(decodedData){
           req.user= await userModel.findById(decodedData.id)
           next()
        }
       }
    }catch(err){
        console.log(err)
        res.status(400).json({
            result:false,
            msg:err.message
        })
    }
}

const authorizeRoles=(...roles)=>{
      return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new Errorhandler(`Role ${req.user.role} does not allowed to access this feature`,403))
        }
        next()
      }
}

module.exports={
    protect,
    authorizeRoles
}