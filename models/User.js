const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    isAdmin:{
        type:Boolean
    }
})

module.exports =mongoose.model('User',userSchema)