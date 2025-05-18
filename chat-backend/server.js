const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()

const CDB = mongoose.connect(process.env.MONGO_DB_LINK,{
   // useNewURLParser:true,
    //useUnifiedTopology:true,
});

CDB.then(()=>{
    console.log("Connected")
}).catch(()=>{
    console.log("Error occured")
})


app.get('/',(req,res)=>res.send('App is running'))

const port = process.env.PORT || 5500
app.listen(port,()=>console.log("Server is running on port# ",port))
