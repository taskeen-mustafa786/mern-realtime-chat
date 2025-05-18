const express = require('express');
require('dotenv').config();

const app = express()

app.get('/',(req,res)=>res.send('App is running'))

const port = process.env.PORT || 5500
app.listen(port,()=>console.log("Server is running on port# ",port))
