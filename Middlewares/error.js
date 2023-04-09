const Errorhandler=require('../utils/ErrorHandler')

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500
    err.message=err.message || "Internal Server Error"


    if(err.name==="CastError"){
        const message=`Resource not found : Invalid ${err.path}`
        err=new Errorhandler(message,400)
    }

    if(err.code===11000){
        const message=`Duplicate Email Entered`
        err=new Errorhandler(message,400)
    }
    res.status(err.statusCode).json({
        result:false,
        error:err.message
    })
    // next()
}