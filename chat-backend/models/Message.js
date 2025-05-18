const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reciever:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message:String,
    timestamp:{
        type:Date,
        default:Date.now()
    } 
});
