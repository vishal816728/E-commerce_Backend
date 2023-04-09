const userModel=require("../Models/user.model")
const brcypt=require('bcryptjs')
const {createToken}=require('../utils/jwt')
const crypto=require('crypto')
const sendMail=require('../utils/sendMail')
// const tokenModel=require('../Models/forgotpassword.token.model')

async function RegisterUser(req,res,next){
    const {name,email,password}=req.body
    try{
        const findUser=await userModel.findOne({email})
        console.log(findUser)
        if(!findUser){
           
            const newuser=new userModel({
                name,
                email,
                password:brcypt.hashSync(password,10)
            })
            const token=createToken({email,id:newuser._id})
            const options={
                expires:new Date(
                    Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
                ),
                httpOnly:true
            }
            if(newuser){
                await newuser.save()
                res.status(201).cookie("token",token,options).json({ 
                    result:true,
                    msg:"User Registered Successfully",
                    user:newuser,
                    token
                })
            }
        } else{ 
            res.status(400).json({
               result:false,
               msg:"User already exists"
            })
        }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg:err.message,
            result:false
        })
    }
}


async function LoginUser(req,res,next){
    const {email,password}=req.body
    try{
       if(!email || !password){
           res.status(400).json({
            result:false,
            msg:"email Or password cannot be empty"
           })
       }else{
        const findUser=await userModel.findOne({email})
  
        if(findUser){
              const x=await userModel.findOne({email}).select('password')
            const comparepassword=brcypt.compareSync(password,x.password)
            const token=createToken({email,id:findUser._id})
            const options={
                expires:new Date(
                    Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
                ),
                httpOnly:true
            }
            if(comparepassword){
                res.status(200).cookie("token",token,options).json({
                    result:true,
                    msg:"successfully Logged in",
                    data:findUser,
                    token
                })
            }else{
                res.status(401).json({
                    result:false,
                    msg:"Invalid Credentials."
                })
            }
        } else{ 
            res.status(400).json({
               result:false,
               msg:"User does not exists"
            })
        }
       }
    }catch(err){
        console.log(err)
        res.status(400).json({
            msg:err.message,
            result:false
        })
    }
}

async function LogOut(req,res){
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        })
        res.status(200).json({
            msg:"Logout Successfully",
            result:true
        })
}


const algorithm = process.env.ENCRYPTION_METHOD; 

const initVector = crypto.randomBytes(16);


// secret key generate 32 bytes of random data
const Securitykey = crypto.randomBytes(32);

function Encrypt_data(message){

    const cipher = crypto.createCipheriv('aes-256-cbc', Securitykey, initVector);
    let encryptedData = cipher.update(message, "utf-8", "hex");
    
    encryptedData += cipher.final("hex");
    return encryptedData
}

// the decipher function
// const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

// let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

// decryptedData += decipher.final("utf8");



async function ForgotPassword(req,res,next){
     const {email}=req.body
     try{
         const findUser=await userModel.findOne({email})
         if(!findUser){
            res.status(404).json({
                result:false,
                msg:"user with this email does not exist"
            })
         }else{
            var randomToken=crypto.randomBytes(10).toString('hex')
            const resetToken=Encrypt_data(randomToken)
            findUser.resetPasswordToken=resetToken
            findUser.resetPasswordExpire=Date.now()+10*60*1000
            await findUser.save()
            const ResetPasswordLink=`${req.protocol}://${req.hostname}:7000/api/v1/user/resetpass/${randomToken}`
            sendMail({
                email:findUser.email,
                text:"Recovery for Password",
                message:` Your Link for Resetting the password is ${ResetPasswordLink}`
            })
            res.status(200).json({
                result:true,
                data:resetToken
            })
         }
     }catch(err){
        res.status(400).json({
            msg:err.message,
            result:false
        })
     }
}

async function ResetPassword(req,res){
     const {password,confirm_password}=req.body
     const {token}=req.params
     const decryptedData=Encrypt_data(token)
     try{
         const user=await userModel.findOne({
             resetPasswordToken:decryptedData,
             resetPasswordExpire:{$gt:Date.now()}
         })
        if(password!==confirm_password){
            res.status(404).json({
                result:false,
                msg:"Password does not match."
            })
        }else if(!user){
                res.status(404).json({
                    msg:"Reset password token is invalid or Expired",
                    result:false
                })
        }else{
        user.password=brcypt.hashSync(password,10)
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined
        await user.save()
        res.status(200).json({
            msg:"Password updated successfully",
            result:true
        })
    }
     }catch(err){
        res.status(400).json({
            msg:err.message,
            result:false
        })
     }
}


// Getting the user Details

async function UserDetails(req,res){
    const findUser=await userModel.findOne({_id:req.user.id})
    if(findUser){
        res.status(200).json({
            result:true,
            data:findUser
        })
    }else{
        res.status(404).json({
            result:false,
            msg:"Login to see your details."
        })
    }
}

async function updatePassword(req,res){
    const {oldpassword,newpassword,confirmpassword}=req.body
    const findUser=await userModel.findOne({_id:req.user._id}).select('+password')
    if(findUser){
        const verifyOldpassword=brcypt.compareSync(oldpassword,findUser.password)
        if(verifyOldpassword){
            if(newpassword===confirmpassword){
            const updatepassword=await userModel.findByIdAndUpdate({_id:req.user.id},{
                password:brcypt.hashSync(newpassword,10)
            })
            res.status(200).json({
                result:true,
                msg:"Successfully Updated the password."
            })
        }else{
            res.status(404).json({
                result:false,
                data:"password do not match"
            })
        }
        }else{
            res.status(404).json({
                result:false,
                data:"old password is wrong"
            })
        }
    }else{
        res.status(404).json({
            result:false,
            msg:"Login to see update your profile."
        })
    }
}


async function updateProfile(req,res){
    const {name,email}=req.body
    const findUser=await userModel.findOne({_id:req.user._id})
    if(findUser){
            const updateprofile=await userModel.findByIdAndUpdate({_id:req.user.id},{
                name,
                email
            })
            if(updateprofile){
                res.status(200).json({
                    result:true,
                    msg:"Successfully Updated the profile."
                })
            }else{
                res.status(404).json({
                    result:false,
                    msg:"Something went wrong"
                })
            }
        
    }else{
        res.status(404).json({
            result:false,
            msg:"Login to see update your profile."
        })
    }
}

// User Admin Routes Controller
async function GetAllUsers(req,res){
    try{
            const findAllUsers=await userModel.find({})
            if(findAllUsers){
                res.status(200).json({
                    result:true,
                    data:findAllUsers
                })
            }
    }catch(err){
        res.status(404).json({
            result:false,
            msg:err.message
        })
    }
}

async function GetIndividualUserDetails(req,res){
    try{
        const findUser=await userModel.findOne({_id:req.params.id})
        if(findUser){
            res.status(200).json({
                result:true,
                data:findUser
            })
        }else{
            res.status(404).json({
                result:true,
                msg:"user not found"
            })
        }
}catch(err){
    res.status(404).json({
        result:false,
        msg:err.message
    })
}
}


async function UpdateIndividualProfileByAdmin(req,res){
    try{
        const {name,email,role}=req.body
    const findUser=await userModel.findOne({_id:req.params.id})
    if(findUser){
            const updateprofile=await userModel.findByIdAndUpdate({_id:req.params.id},{
                name,
                email,
                role
            })
            if(updateprofile){
                res.status(200).json({
                    result:true,
                    msg:"Successfully Updated the profile."
                })
            }else{
                res.status(404).json({
                    result:false,
                    msg:"Something went wrong"
                })
            }
        
    }else{
        res.status(404).json({
            result:false,
            msg:"User Not Found"
        })
    }
}catch(err){
    res.status(404).json({
        result:false,
        msg:err.message
    })
}
}

async function DeleteUser(req,res){
    try{
        const deluser=await userModel.findByIdAndDelete({_id:req.params.id})
        if(deluser){
            res.status(200).json({
                msg:"Successfully Deleted the User",
                result:true
            })
        }else{
            res.status(404).json({
                msg:"User Not Found",
                result:false
            })
        }
    }catch(err){
        res.status(404).json({
            result:false,
            msg:err.message
        })
}
}
module.exports={
    RegisterUser,
    LoginUser,
    LogOut,
    ForgotPassword,
    ResetPassword,
    UserDetails,
    updatePassword,
    updateProfile,
    GetAllUsers,
    GetIndividualUserDetails,
    UpdateIndividualProfileByAdmin,
    DeleteUser
}
