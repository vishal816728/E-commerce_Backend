const app=require("./app.js")
require('dotenv').config()

const Dbconnection=require('./config/DB/Database.js')

// unhandled uncaught exception
// when you use undefined variable 

process.on('uncaughtException',(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`server is closing due to Unhandled Uncaught Exception`)
    process.exit(1)
})

Dbconnection()


const server=app.listen(process.env.PORT,()=>{
    console.log(`server is listening on ${process.env.PORT}`)
})

// unhandled Promise Rejection (May be due to Database connection)
// use this when you are not using try and catch while making mongo connection

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`)
    console.log(`server is closing due to Unhandled Promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
}) 