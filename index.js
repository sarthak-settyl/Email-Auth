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
const testUrl = 'mongodb://localhost:27017/settyl-car';
const public = require('./model/userData')
mongoose.connect(testUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log("mongo live Connection Open")
    }
).catch(err => {
    console.log("Error")
    console.log(err)
});
app.use(parser.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))


async function sendmail(reciverMail, password) {
    // declare vars,
    let fromMail = 'Enter your email';
    let toMail = reciverMail;
    let subject = 'Your secure password';
    let text = password;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: fromMail,
            pass: 'Enter your password'
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



app.post('/createNewUser', async (req, res) => {
    try {
        data = req.body;
        var password = generator.generate({
            length: 10,
            numbers: true
        });
        sendmail(data['email'], password);
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new public({
            "firstname": data["firstname"],
            "lastname": data["lastname"],
            "email": data['email'].toLowerCase(),
            "password": encryptedPassword
        });
        var mail = data['email'].toLowerCase()
        await newUser.save();
        // Create token
        const token = jwt.sign(
            { user_id: newUser._id, mail },
            "secret",
            {
                expiresIn: "2h",
            }
        );
        // save user token
        newUser.token = token;

        // return new user
        res.status(201).json(newUser);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
})
app.post("/login", async (req, res) => {
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await public.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
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
});
  
app.listen(3000, '0.0.0.0', () => {
    console.log("Lisining at port 3000")
})