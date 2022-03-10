const mongoose = require('mongoose')


const appointmentSchema = mongoose.Schema({
    patientname:{
        type:String,
        required:true,
        trim:true


    },
    patientage:{
        type:String,
        required:true,
        trim:true

    },
    mobile:{
        type:String,
        required:true,
        trim:true

    },
    department:{
        type:String,
        required:true,
        trim:true
    },
    doctor:{
        type:String,
        required:true,
        trim:true

    },
    problem:{
        type:String,
        required:true,
        trim:true

    },
    appointmentdate:{
        type:String,
        required:true,
        trim:true

    },
    appointmenttime:{
        type:String,
        required:true,
        trim:true

    },
    charge:{
        type:String,
        required:true,
        trim:true
    }

    

})

module.exports =mongoose.model('appointment',appointmentSchema)