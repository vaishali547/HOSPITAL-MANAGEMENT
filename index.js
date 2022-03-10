const express = require('express')
const mongoose= require('mongoose');
const ejs =require('ejs');
const session= require('express-session')
const MongoDBStore= require('connect-mongodb-session')(session);
const app =express()

const routes= require('./routes/route')

require('dotenv').config()

var store= new MongoDBStore({
    uri:process.env.MONGO_LIVE,
    collection:'sessions'
})

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.use(require('express-session')({
    secret:'sfghjk',
    cookie:{
        maxAge:1000*60*24*7//1 week
    },
    store:store,
    resave:true,
    saveUnintialized:true
}));


app.set('view engine','ejs')
app.set('views','views')

app.use('/',routes)

app.get('/',(req,res)=>{
    res.send("welcome")
})

// app.listen(process.env.PORT,()=>{
//     console.log(`server connected at ${process.env.PORT}`);
// })

mongoose
   .connect(process.env.MONGO_LIVE)
   .then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server connected at ${process.env.PORT}`);
   })


})
   .catch(()=>{
       console.log("ERROR!!!!!!!");
   })
   
  