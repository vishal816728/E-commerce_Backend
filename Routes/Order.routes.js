const express=require('express')
const { protect, authorizeRoles } = require('../Middlewares/Auth')

const orderController=require("../Controllers/Order.controller")

const orderRoute=express.Router()

orderRoute.post("/order/new",protect,orderController.createNewOrder)

orderRoute.get("/order/admin/:id",protect,authorizeRoles('admin'),orderController.GetSingleOrder)

module.exports=orderRoute