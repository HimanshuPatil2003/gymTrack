const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

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

//static signup method
userSchema.statics.signup = async function(email, password){
    //email checking if exisit
    const exists=await this.findOne({email})
    if(exists){
        throw Error('Email already in use')
    }

    //first hash the password using bcrypt
    //it adds random string to current pass before hashing

    const salt = await bcrypt.genSalt(10/*no of rounds of hash*/)
    const hash = await bcrypt.hash(password, salt) // bcrypt hash password in this line 


    const user = await this.create({email, password:hash})

    return user

}

module.exports = mongoose.model('User', userSchema)