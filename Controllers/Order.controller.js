const orderModel=require('../Models/Order.model')
const productModel=require("../Models/Product.model")


async function createNewOrder(req,res){
    const {
            ShippingInfo,
            OrderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
    }=req.body
    try{
        if(req.user){
         const neworder=new orderModel({
            ShippingInfo,
            OrderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt:Date.now(),
            user:req.user._id
         })

         await neworder.save()
         res.status(201).json({
            result:true,
            msg:"order is created successfully",
            order:neworder
         })
        }else{
            res.status(404).json({
                msg:"Please Login first to create an order.",
                result:false
            })
        }
    }catch(err){
        res.status(400).json({
            result:false,
            msg:err.message
        })
    }
}

//for admin 
async function GetSingleOrder(){
     const order=await orderModel.findOne({_id:req.params.id}).populate("user","name email")
     if(!order){
        res.status(400).json({
            msg:"Order with this Id not found",
            result:false
        })
     }else{
           res.status(200).json({
            result:true,
            data:order
           })
     }

}

module.exports={
    createNewOrder,
    GetSingleOrder
}