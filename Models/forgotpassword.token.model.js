const mongoose=require('mongoose')

const TokenSchema=mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required field"]
    },
    token:{
        type:String,
        required:[true,"Token is a required field"]
    }
})

module.exports=mongoose.model('Tokens',TokenSchema)