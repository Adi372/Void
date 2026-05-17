const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }],
    hiddenFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages"
        },
        text: {
            type: String,
            default: ""
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
        },
        createdAt: {
            type: Date,
            default: null
        },
    }
}, {timestamps: true})

const chatModel = mongoose.model("chats", chatSchema);
module.exports = chatModel;