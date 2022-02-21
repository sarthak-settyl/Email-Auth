require("dotenv").config();
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
const userRoutes = require('./routes/userRoutes')
// const public = require('./model/userData')
// const driver = require('./model/driver')

app.use(parser.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(modeluser, { useNewUrlParser: true, useUnifiedTopology: true }).then(
    () => {
        console.log("mongo live Connection Open")
    }
).catch(err => {
    console.log("Error")
    console.log(err)
});

app.use('/',userRoutes);
app.listen(process.env.PORT || 5500, '0.0.0.0', () => {
    console.log("Lisining at port 3000")
})