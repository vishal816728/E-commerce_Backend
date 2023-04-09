const mongoose=require('mongoose')

async function ConnectionDB(){
    // try{
        const conn=await mongoose.connect(process.env.MONGOURI)
        if(conn){
            console.log(`Database is connected`)
        }
    // }catch(err){
    //      console.log(err.message)
    // }
}

module.exports=ConnectionDB