const express = require('express')
const path = require('path')
const app = express()
const nodemailer = require("nodemailer");
const generator = require('generate-password');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const parser = require('body-parser')
const cors = require('cors')
const pass = process.env.PASSWORD
const otpSecret = process.env.OTP_SECRET;
const modeluser = process.env.DATABASE_CLOUD;
// const public = require('./model/userData')
const driver = require('../models/driver')
const SETTYLJWTKEY = process.env.SETTYL_JWT_KEY;

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
    try {
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                throw Error({message: error.message})
            }
            console.log(response)
        });
    } catch(error) {
        throw Error({message: error.message});
    }
    
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
exports.verifyOtp = async(req,res)=>{
    try{
        const {hashedOtp,otp} = req.body;
        const splitHashData = hashedOtp.split('.');
        
        const userOtp = crypto.createHash('sha256' , otpSecret).update(`${otp}`).digest('hex');
        

        if(Date.now() > parseInt(splitHashData[1])) {
            return res.status(400).json({message: "OTP expired"});
        }
        if(splitHashData[0] !== userOtp) {
            return res.status(401).json({message: "Invalid OTP"});
        }
        return res.status(200).json({message: "OTP verified"})
    }catch(err){
        return res.status(500).json({message: error.message})
    }
};

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
        // var otp = generator.generate({
        //     length: 6,
        //     numbers: true
        // });
        var otp = crypto.randomInt(10000,99999);
        const timeToExpiry = 1000 * 60;
        let currentTime = Date.now() + timeToExpiry;
        const encryptedPassword = crypto.createHash('sha256' , otpSecret).update(`${otp}`).digest('hex');
        await sendmail(email, `${otp}`);

        // Validate user input
        //Encrypt user password
        // await user.updateOne({"password":encryptedPassword})
        // if (!(email)) {
        //     res.status(400).send("All input is required");
        // }
        console.log(user)
        console.log(email)
        const sendingotp = {encrypt:`${encryptedPassword}.${currentTime}`};
        res.status(200).json(sendingotp);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Server Error"});
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
            SETTYLJWTKEY,
            {
              expiresIn: "2h",
            }
          );
          const accessToken = jwt.sign(
            { user_id: user._id, email },
            SETTYLJWTKEY,
            {
              expiresIn: "1500s",
            }
          );
    
          // save user token
          user.token = token;
          user.accessToken = accessToken;
          let tokenJson = {token:token};
          const sendingData = Object.assign(tokenJson, user);
          console.log(token);
          console.log(user);
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

exports.userAuthentication = async(req,res)=>{
    const {token} = req.body;
    try{
        const decoded = jwt.verify(token,SETTYLJWTKEY);
        const user = await driver.findOne({ "contactInfo.emailId": decoded.email });
        if(user===null){
            return res.status(400).send("User Not Found");
        }
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        return res.status(404).json({ message: "Token is invalid or expired." });
    }
}