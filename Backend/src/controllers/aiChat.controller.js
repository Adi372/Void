const aiChatModel = require('../models/AI/aiChat.model');
const aiMessageModel = require('../models/AI/aiMsg.model');

async function findOrCreate(req, res) {
    try{
        const user = req.user;
        let chat = await aiChatModel.findOne({
            user: user._id
        });
        if(chat){
            return res.status(200).json({
                message: "Chat opened successfully",
                chatId: chat._id,
                title: chat.title,
                lastMessage: chat.lastMessage, 
            })
        }
        else{
            chat = await aiChatModel.create({
                user: user._id,
                title: `Chat between ${user.username} and AI`,
            })
            return res.status(201).json({
                message: "Chat created successfully",
                chatId: chat._id,
                title: chat.title,
                lastMessage: chat.lastMessage
            })
        }
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to open chat",
            error: err.message
        })
    }
}


async function loadAIMessages(req, res) {
    try{
        const user = req.user;
        const {chatId} = req.body;
        const chat = await aiChatModel.findOne({
            _id: chatId,
            user: user._id
        });
        if(!chat){
            return res.status(404).json({
                message: "Chat not found",
            })
        } 

        const messages = await aiMessageModel.find({chat: chat._id}).sort({createdAt: 1});
  
        return res.status(200).json({
            message: "Messages loaded",
            messages: messages
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to load messages",
            error: err.message
        })
    }
}

module.exports= {
    findOrCreate,
    loadAIMessages
}