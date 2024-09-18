const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

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

    //validation using validator package
        if(!email || !password){
            throw Error("All field must be filled") 
        }
        if(!validator.isEmail(email)){
            throw Error("Email is not valid")
        }
        if(!validator.isStrongPassword(password)){
            throw Error("Password not strong enough")
        }



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

//static login method
userSchema.statics.login = async function(email, password){
    //validation using validator package
    if(!email || !password){
        throw Error("All field must be filled") 
    }

    //email checking if exisit
    const user=await this.findOne({email})
    if(!user){
        throw Error('email NOT exists')
    }

    //user present check password
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error("incorrect password")
    }

    return user

}

module.exports = mongoose.model('User', userSchema)