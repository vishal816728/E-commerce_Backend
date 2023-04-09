module.exports=(Function)=>{
    Promise.resolve(Function(req,res,next)).catch(next)
}