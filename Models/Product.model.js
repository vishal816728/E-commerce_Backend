const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Provide the Name of the Product"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Provide the Description of the Product"]
    },
    price:{
        type:Number,
        required:[true,"Please Provide the price of the Product"],
        maxLength:[8,"price cannot exceed the limit of 8 digits"]
    },
    ratings:{
        type:Number,
        default:0,
    },
    image:[
        {
        publicid:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }
    ],
    category:{
        type:String,
        required:[true,"please provide a valid category"]
    },
    stock:{
        type:Number,
        required:[true,"please enter the current stock of the product"],
        maxLength:[6,"stock limit cannot exceed the limit of 6 digits"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ]
},{
    timestamps:true
})

module.exports=mongoose.model('Products',ProductSchema)