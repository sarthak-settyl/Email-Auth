const express = require('express')
const path = require('path')
const app = express()
const nodemailer = require("nodemailer");
const generator = require('generate-password');
const mongoose = require('mongoose');
const parser = require('body-parser')
const cors = require('cors')
const pass = process.env.PASSWORD
const testUrl = 'mongodb://localhost:27017/settyl-car';
const public = require('./model/userData')
mongoose.connect(testUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(
    ()=>{
      console.log("mongo live Connection Open")  
    }
).catch(err =>{
    console.log("Error")
    console.log(err)
});
app.use(parser.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))


async function sendmail(reciverMail,password){
    // declare vars,
    let fromMail = 'enter your email';
    let toMail = reciverMail;
    let subject = 'Your secure password';
    let text = password;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromMail ,
            pass: 'enter your password'
        }
        });
    // email options
    let mailOptions = {
        from: fromMail,
        to: toMail,
        subject: subject,
        text: text
    };
    // send email
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
          console.log(error);
        }
        console.log(response)
    });
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}



app.post('/createNewUser',async(req,res)=>{
    data = req.body;
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    sendmail(data['email'],password);
    console.log(data);
    res.send({
        "email":data["email"],
        "password":password
    })
})
app.listen(3000,'0.0.0.0',()=>{
    console.log("Lisining at port 3000")
})