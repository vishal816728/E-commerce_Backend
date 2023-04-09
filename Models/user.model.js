const mongoose=require('mongoose')
const validator=require('validator')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required."]
    },
    email:{
        type:String,
        required:[true,"Email is required."],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"password is a necessary field"],
        select:false // which when you enter each field will be returned apart from this
    }
    ,
    avatar:
        {
            public_id:{
                type:String,
                default:"Sample_id"
            },
            url:{
                type:String,
                default:"https://cdn-icons-png.flaticon.com/512/1503/1503151.png"
            }
        }
    ,
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{
    timestamps:true
})

module.exports=mongoose.model("Users",UserSchema)