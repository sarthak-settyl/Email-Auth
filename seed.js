const mongoose = require('mongoose');

const public = require('./model/userData')
mongoose.connect('mongodb://localhost:27017/settyl-car', {useNewUrlParser: true, useUnifiedTopology: true}).then(
    ()=>{
      console.log("mongo live Connection Open")  
    }
).catch(err =>{
    console.log("Error")
    console.log(err)
});

const seedPublic = [
  {
    firstname:"mongo",
    lastname:"db",
    password:"RaNdOm",
    email:"randomgenerated@gmail.com"
  },
  {
    firstname:"mongo3",
    lastname:"db3",
    password:"RaNdOm3",
    email:"randomgenerated3@gmail.com"
  },
]

public.insertMany(seedPublic).then(res=>{
  console.log(res)
}).catch(e=>{console.log(e)})