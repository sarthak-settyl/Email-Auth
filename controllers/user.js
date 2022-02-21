const express = require('express')
const path = require('path')
const app = express()
const nodemailer = require("nodemailer");
const generator = require('generate-password');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const parser = require('body-parser')
const cors = require('cors')
const pass = process.env.PASSWORD
const modeluser = process.env.DATABASE_CLOUD;
// const public = require('./model/userData')
const driver = require('../models/driver')

async function sendmail(reciverMail, password) {
    // declare vars,
    let fromMail = 'sb8377@srmist.edu.in';
    let toMail = reciverMail;
    let subject = 'Your secure password';
    let text = password;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromMail,
            pass: 'Sanjeev@5'
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

exports.validateUser = async(req,res)=>{
    try{
        const { email } = req.body;
        const user = await driver.findOne({"contactInfo.emailId":email });
        if(user===null){
            res.status(400).send("User Not Found");
        }
        console.log(String(user.isVerified));
        if(user.isVerified=='true'){
            res.status(401).json(user);
            return;
        }
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        sendmail(email, password);
        // Validate user input
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
        await user.updateOne({"password":encryptedPassword})
        if (!(email)) {
            res.status(400).send("All input is required");
        }
        console.log(user)
        console.log(email)
        res.status(200).json(user);
    }catch(err){

    }
};
exports.verifypassword = async (req,res) =>{
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await driver.findOne({"contactInfo.emailId":email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
            await user.updateOne({"isVerified":"true"})
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            "secret",
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
};

exports.updatepassword = async(req,res)=>{
    try{
        const { email, password } = req.body;
        const user = await driver.findOne({"contactInfo.emailId":email });
        if(user===null){
            res.status(400).send("User Not Found");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        await user.updateOne({"password":encryptedPassword})
        res.status(200).json(user);
    }catch(err){}
};
exports.updateTimeZone = async(req,res)=>{
    try{
        const { email, timeZone,language } = req.body;
        const user = await driver.findOne({"contactInfo.emailId":email });
        if(user===null){
            res.status(400).send("User Not Found");
        }
        await user.updateOne({"settings":{"timeZone":timeZone,"language":language}})
        res.status(200).json(user);
    }catch(err){}
};