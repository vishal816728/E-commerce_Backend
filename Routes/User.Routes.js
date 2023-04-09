const express=require('express')
const userRouter=express.Router()
const userController=require("../Controllers/User.controller")
const {protect,authorizeRoles}=require("../Middlewares/Auth")

userRouter.post("/user/new/registration",userController.RegisterUser)

userRouter.post("/user/login",userController.LoginUser)

userRouter.get("/user/logout",userController.LogOut)

userRouter.post('/user/forgotpassword',userController.ForgotPassword) 

userRouter.patch("/user/resetpass/:token",userController.ResetPassword)

userRouter.get("/user/getdetails",protect,userController.UserDetails)

userRouter.patch("/user/updatepassword",protect,userController.updatePassword)

userRouter.patch("/user/updateprofile",protect,userController.updateProfile)

// User Routes for Admin

userRouter.get("/user/admin/getallusers",protect,authorizeRoles("admin"),userController.GetAllUsers)

userRouter.get("/user/admin/getindividualuserdetails/:id",protect,authorizeRoles("admin"),userController.GetIndividualUserDetails)

userRouter.patch("/user/admin/updateuserprofile/:id",protect,authorizeRoles('admin'),userController.UpdateIndividualProfileByAdmin)

userRouter.delete("/user/admin/deluser/:id",protect,authorizeRoles('admin'),userController.DeleteUser)



module.exports=userRouter

