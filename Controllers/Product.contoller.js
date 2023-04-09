const ProductModel=require('../Models/Product.model')
const Errorhandler = require('../utils/ErrorHandler')
const TryCatchReplacement=require('../Middlewares/catchAsyncErrors')
const ApiFeatures=require('../utils/ApiFeatures')
// in order to use this first don't use try and catch inside async function and paste the async function inside
// TryCatchReplacement()
//for example TryCatchReplacement(async function(req,res)=>{res.send("hi")})
async function Createproduct(req,res){
    const {name,price,description,category,image}=req.body
    // req.body.user=req.user.id
    try{
        const createProduct=new ProductModel({
            name,
            description,
            price,
            category,
            image,
            user:req.user.id
        })
        await createProduct.save()
        // const createProduct=await ProductModel.create(req.body)
        if(createProduct){
            res.status(201).json({
                reseult:true,
                msg:"Product is created successfully",
                createProduct
            })
        }
    }catch(err){
        res.status(400).json({
            result:false,
            msg:err.message
        })
    }
}

async function GetAllProducts(req,res){
    try{
        let ResultPerPage=10
        let productCount=await ProductModel.countDocuments()
        const features=new ApiFeatures(ProductModel.find({}),req.query)
        .search()
        .filter()
        .Pagination(ResultPerPage)
        // const findAllProducts=await ProductModel.find({})
        const findAllProducts=await features.query;
        console.log(findAllProducts)
        if(findAllProducts){
            res.status(200).json({
                result:true,
                data:findAllProducts,
                productCount 
            })
        }
    }catch(err){
        res.status(400).json({
            result:false,
            msg:err.message
        })
    }
}

async function UpdateProduct(req,res,next){
    const {id}=req.params
     try{
        var findProduct=await ProductModel.findOne({_id:id})            
        if(findProduct){
             findProduct=await ProductModel.findByIdAndUpdate(req.params.id,req.body,{
                new:true,
                runValidators:true,
                useFindAndModify:false
             })
             res.status(200).json({
                result:true,
                findProduct
             })
        }else{
            return next(new Errorhandler("Product Not found",404))
        }
    }catch(err){
        res.status(400).json({
            result:false,
            msg:err.message
        })
    }
}

async function DeleteProduct(req,res,next){
    try{
       const delProduct=await ProductModel.findByIdAndDelete({_id:req.params.id})
       // instead of doing like we can find the product by id and then await product.remove()
       if(delProduct){
        res.status(200).json({
            result:true,
            msg:"Successfully Deleted the product"
        })
       }else{
        return next(new Errorhandler("Product Not found",404))
       }
    }catch(err){
        res.status(500).json({
            result:false,
            msg:err.message
        })
    }
}


// get the individual product

async function GetIndividualProduct(req,res,next){
    try {
        const product=await ProductModel.findOne({_id:req.params.id})
    if(product){
        res.status(200).json({
            result:true,
            product
        })
    }else{
        return next(new Errorhandler("Product Not found",404))
    }
    } catch (error) {
        res.status(500).json({
            result:false,
            msg:error.message
        })
    }
}

async function createProductReview(req,res){
    const {rating,comment,productId}=req.body
    const reviewObjectOptions={
         user:req.user._id,
         name:req.user.name,
         rating:Number(rating),
         comment
    }
    try{
        const product=await ProductModel.findOne({_id:productId})        
        const isReviewd=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
        if(product){
            if(isReviewd){
                product.reviews.forEach(rev=>{
                    if(rev.user.toString()===req.user._id.toString()){
                        rev.rating=rating
                        rev.comment=comment
                    }
                }) 
            }else{
                product.reviews.push(reviewObjectOptions)
                product.numOfReviews=product.reviews.length
            }
            let avg=0
            product.reviews.forEach(rev=>avg+=rev.rating)
            product.ratings=avg/product.reviews.length

            await product.save()
            res.status(200).json({
                msg:"Successfully added the review",
                result:true
            })
        }else{
             res.status(200).json({
                msg:"Product Does Not Exist With This ProductId",
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

async function GettingAllReviewsOfAProduct(req,res){
    try{
        const findProduct=await ProductModel.findOne({_id:req.params.productId})
        if(findProduct){
             res.status(200).json({
                result:true,
                reviews:findProduct.reviews
             })
        }else{
            res.status(400).json({
                result:false,
                msg:"Product is not Found"
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
    GetAllProducts,
    Createproduct,
    UpdateProduct,
    DeleteProduct,
    GetIndividualProduct,
    createProductReview,
    GettingAllReviewsOfAProduct
}