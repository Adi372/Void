const mongoose = require('mongoose');
const aiChatSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    lastMessage: {
        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "aiMessages"
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
}, {
    timestamps: true
})
const aiChatModel = mongoose.model("aiChats", aiChatSchema);
module.exports = aiChatModel;