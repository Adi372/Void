const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    senderPic:{
        type: String
    },
    text: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});

const messageModel = mongoose.model("messages", messageSchema);
module.exports = messageModel;