const mongoose = require('mongoose')


const departmentSchema = mongoose.Schema({
  department:{
    type:String,
    required:true,
    trim:true
  } ,
  deptdescription:{
    type:String,
    required:true,
    trim:true

  },
  deptphotopath:{
    type:String,
    required:true,
    trim:true
  },
  doctordes:{
    type:Array,
    required:true,
    trim:true
  }
  

})

module.exports = mongoose.model('Department',departmentSchema)