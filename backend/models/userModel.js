const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true //no two user qith same email
    },
    password:{
        type:String,
        unique:true
    }

})

module.exports = mongoose.model('User', userSchema)