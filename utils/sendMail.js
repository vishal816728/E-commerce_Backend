const nodemailer=require('nodemailer')

async function sendMail(options){
   const transporter=nodemailer.createTransport(
    {
        host:'smtp.gmail.com',
        port:465,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        }
    }
   )
   const mailOptions={
    from:process.env.SMTP_USER,
    to:options.email,
    subject:options.subject,
    text:options.message
   }

   await transporter.sendMail(mailOptions)
}

module.exports=sendMail