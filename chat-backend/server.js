const express = require('express');

const app = express()

app.get('/',(req,res)=>res.send('App is running'))

const port = 5500
app.listen(port,()=>console.log("Server is running on port# ",port))
