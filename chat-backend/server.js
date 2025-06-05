const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const messageRoutes = require('./routes/messageRoutes')



const app = express()
app.use("/api/messages", messageRoutes);

const CDB = mongoose.connect(process.env.MONGO_DB_LINK,{
   // useNewURLParser:true,
    //useUnifiedTopology:true,
});

CDB.then(()=>{
    console.log("Connected")
}).catch(()=>{
    console.log("Error occured")
})


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    socket.broadcast.emit("receiveMessage", { sender, message }); // send to all except sender
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



app.get('/',(req,res)=>res.send('App is running'))

const port = process.env.PORT || 5500
app.listen(port,()=>console.log("Server is running on port# ",port))
