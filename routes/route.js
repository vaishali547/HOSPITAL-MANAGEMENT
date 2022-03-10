const express = require('express')
const router =express.Router()
const path = require('path')
const multer= require('multer')
const bcrypt=require('bcrypt')

const controller =require('../controllers/usercontroller')
const User = require('../models/User')
const Department = require('../models/department')
const isUser = require('../middleware/isUser')
const isAdmin = require('../middleware/isAdmin')

const Appointment = require('../models/appointment')
const { resourceUsage } = require('process')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/aadhar')
    },
    filename: function (req, file, cb) {
      const fileName=`Aadhar_${req.session.user.username}.${file.mimetype.split('/')[1]}`
      cb(null, fileName)
    }
  })
  const upload = multer({ storage: storage ,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    }
    })
router.get('/', (req,res)=>{
        res.render('landingpage')
    })  
router.get('/home', (req,res)=>{
    res.render('home')
})
router.get('/contact', (req,res)=>{
    res.render('contact')
})
router.get('/aboutus',(req,res)=>{
    res.render('aboutus')
})

router.get('/department', isUser,(req,res)=>{
    res.render('department',{userid:req.session.user._id})
})

router.get('/appointments', isUser,(req,res)=>{
    res.render('appointments',{userid:req.session.user._id})
})

router.get('/viewappointments', isUser,async (req,res)=>{
    const result = await Appointment.find({UserId:req.params.id})
    res.render('viewappointments',{result,userid:req.session.user._id})
})

// router.get('/admin/viewappointments', isAdmin,async (req,res)=>{
//     const result = await Appointment.find()
//     res.render('viewappointments',{result})
// })

router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.get('/login',(req,res)=>{
    res.render('login',{msg:''})
})

router.get('/adminlogin',(req,res)=>{
    res.render('adminlogin')
})

router.get('/department/:depart',async (req,res)=>{

    const result = await Department.find({department:req.params.depart})
    // const depart = await Department
    // console.log(result)

    res.render('doctor', {doctors:result[0].doctordes,depart:result[0]})
})

router.post('/checkdata',async(req,res)=>{
    const result= await User.find({username:req.body.username})
    if(result.length>0){
        const isTrue=bcrypt.compareSync(req.body.password,result[0].password);
        if(isTrue){
            req.session.user= result[0]
            req.session.save(()=>{
                res.redirect('/appointments')
            })
        }
        
    
        else{
            res.render('login',{msg:'Incorrect Password'}) 
        }}
        else{
            res.render('login',{msg:'User not Registered'})
        }
    
})

router.post('/savedata',async(req,res)=>{
    const hashedPassword= bcrypt.hashSync(req.body.password,12);
    const data= {
        username:req.body.username,
        email:req.body.email,
        mobile:req.body.mobile,
        password:hashedPassword,
        isAdmin:false
    }
    const result = await User(data).save()
    if(result){
        return res.redirect('/login')
    }
    else{
        return res.redirect('/signup')
    }
})

router.post('/summary',upload.single('fufile'),async (req,res)=>{


    // console.log(req.file)
    const depart = await Department.find({department:req.body.department})
    const docs = depart[0].doctordes

    // console.log(docs[0])
    
    var charge = ''
    if(docs[0].doctor == req.body.doctor) {
        console.log(docs[0].appointmentfee)
        charge += docs[0].appointmentfee
        // console.log(charge)
    }
    else if(docs[1].doctor == req.body.doctor) {
        console.log(docs[1].appointmentfee)
        charge += docs[1].appointmentfee
        // console.log(charge)
    }
    
    // console.log('charge',charge)

    const dat= {
        patientname:req.body.patientname,
        patientage:req.body.patientage,
        mobile:req.body.mobile,
        department:req.body.department,
        doctor:req.body.doctor,
        problem:req.body.problem,
        document:req.file.path,
        appointmentdate:req.body.choosedate,
        appointmenttime:req.body.choosetime,
        charge:charge
    }

    const resul= await Appointment(dat).save()
    // var department = req.body.department;
    
    // switch(department) {
    //     case 'cardiology':
        
    //     if( req.body.doctor =='truluck'){charge =charge +300
    //     break;}
    //      else if(req.body.doctor== 'hart') {charge= charge + 400
    //         break;}
    //      else {charge =charge
    //         break;}
    //     break;    
    //       const result = await(dat.charge =charge)
    // }
    const result= await Appointment.find()
    res.render('viewappointments',{result,userid:req.session.user._id})
 })

//  router.post('/patientform/:info', async( req,res)=>{
//      var data= JSON.parse(req.params.info)
//      console.log(data)
//      const resul= await Appointment(data).save()
//      const result= await Appointment.find()
//      res.render('/viewappointments',{result})
//  })
router.get('/cancelappointment/:id',async(req,res)=>{
    const id=req.params.id
    await Appointment.findByIdAndDelete(id)
    const result=await Appointment.find()
    res.render('viewappointments',{result})
})

module.exports = router



