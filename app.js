const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')

const productroutes=require('./Routes/Product.routes')
const userRoutes=require("./Routes/User.Routes")
const orderRoute=require("./Routes/Order.routes")
const ErrorMiddleware=require('./Middlewares/error')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/api/v1",productroutes)
app.use('/api/v1',userRoutes)
app.use("/api/v1",orderRoute)
app.use(ErrorMiddleware) 


module.exports=app