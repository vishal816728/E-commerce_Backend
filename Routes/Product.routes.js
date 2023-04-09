const express=require('express')
const productroutes=express.Router()

const ProductController=require('../Controllers/Product.contoller')
const {protect,authorizeRoles}=require('../Middlewares/Auth')

productroutes.route("/getallproducts").get(ProductController.GetAllProducts)

productroutes.post("/products/create/new",protect,authorizeRoles("admin"),ProductController.Createproduct)

productroutes.put("/products/update/:id",protect,authorizeRoles("admin"),ProductController.UpdateProduct)

productroutes.delete("/products/delete/:id",protect,authorizeRoles("admin"),ProductController.DeleteProduct)

productroutes.get("/getindividualproduct/:id",ProductController.GetIndividualProduct)

productroutes.patch("/product/add/review",protect,ProductController.createProductReview)

productroutes.get("/product/:productId/reviews",ProductController.GettingAllReviewsOfAProduct)

module.exports=productroutes