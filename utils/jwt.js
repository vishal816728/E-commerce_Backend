const jwt=require('jsonwebtoken')

function createToken(payload){
    const token=jwt.sign(payload,
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRY})
        return token
} 
const verifyJwt=(token)=>{
    jwt.verify(token,process.env.JWT_SECRET)
}
module.exports={
    createToken,
    verifyJwt
}