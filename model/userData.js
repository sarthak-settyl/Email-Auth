const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})
const public = mongoose.model('Public',modelSchema);
module.exports = public;