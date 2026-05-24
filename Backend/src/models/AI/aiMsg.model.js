const mongoose = require('mongoose');

const aiMsgSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "aiChats"
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["human", "ai", "system"],
        default: "human"
    }
},{timestamps: true})

const aiMsgModel = mongoose.model("aiMessages", aiMsgSchema);
module.exports = aiMsgModel;