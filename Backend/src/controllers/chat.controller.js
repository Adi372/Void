const chatModel = require('../models/chats.model');
const userModel = require('../models/users.model');
const messageModel = require('../models/messages.model');

async function findOrCreate(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;
        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isFriends = 
        user1.friends.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.friends.some(id=>
            id.toString() === user1._id.toString()
        )

        if(!isFriends){
            return res.status(400).json({
                message: "You need to be friends with the user to chat"
            })
        }

        const blocked = 
        user1.blockedUser.some(id=>
            id.toString() === user2._id.toString()
        ) ||
        user2.blockedUser.some(id=>
            id.toString() === user1._id.toString()
        );

        if(blocked){
            return res.status(400).json({
                message: "Failed to open chat"
            })
        }

        let chat = await chatModel.findOne({
            isGroupChat: false,
            participants: {
                $all: [user1._id, user2._id]
            },
            $expr: {
                $eq: [
                    {$size: "$participants"},
                    2
                ]
            }
        });

        if(!chat){
            chat = await chatModel.create({
                participants: [user1._id, user2._id]
            });
            return res.status(201).json({
                message: "New Chat created",
                chatId: chat._id,
                participants: chat.participants,
                messages: []
            });
        }

        const hiddenForMe = chat.hiddenFor.some(
            id => id.toString() === user1._id.toString()
        );
        if(hiddenForMe){
            await chatModel.updateOne(
                {_id: chat._id},
                {
                    $pull: {
                        hiddenFor: user1._id
                    }
                }
            )
            return res.status(200).json({
                message: "Chat reopened successfully",
                chatId: chat._id,
                participants: chat.participants,
            })
        };

        const hiddenForUser2 = chat.hiddenFor.some(
            id => id.toString() === user2._id.toString()
        );

        if(hiddenForUser2){
            await chatModel.updateOne(
                {_id: chat._id},
                {
                    $pull: {
                        hiddenFor: user2._id
                    }
                }
            )
            const messages = await messageModel.find({
                chatId: chat._id
            }).sort({createdAt: 1});
            return res.status(200).json({
                message: "Chat opened successfully",
                chatId: chat._id,
                participants: chat.participants,
                messages: messages
            })
        }

        const messages = await messageModel.find({
            chatId: chat._id
        }).sort({createdAt: 1});

        return res.status(200).json({
            message: "Chat opened successfully",
            chatId: chat._id,
            participants: chat.participants,
            messages: messages
        })

    }
    catch(err){
        return res.status(500).json({
            message: "Failed to open chat",
            error: err.message
        })
    }
}

async function deleteMessage(req, res) {
    try{
        const user = req.user;
        const {chatId, messageId} = req.body;

        const chat = await chatModel.findById(chatId);
        if(!chat){
            return res.status(404).json({
                message: "Chat doesn't exist"
            })
        }

        const message = await messageModel.findById(messageId);
        if(!message){
            return res.status(404).json({
                message: "Message not found"
            })
        }

        if(message.isDeleted){
            return res.status(400).json({
                message: "Message already deleted"
            })
        }
        
        const isMsgFromChat = (message.chatId.toString() === chat._id.toString());
        if(!isMsgFromChat){
            return res.status(404).json({
                message: "This message isn't from this chat"
            })
        }

        const validSender = 
        ((message.sender.toString() === user._id.toString()) && 
        chat.participants.some(id=> id.toString() === user._id.toString()));

        if(!validSender){
            return res.status(401).json({
                message: "Forbidden: You cannot delete someone else's message"
            })
        }

        const isLastMessage = chat.lastMessage?.messageId?.toString() === message._id.toString();
        if(isLastMessage){
            chat.lastMessage.text = "This message was deleted";
            await chat.save();
        }
        message.text = "This message was deleted";
        message.isDeleted = true;
        await message.save();

        return res.status(200).json({
            message: "Message deleted successfully"
        })
        
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to delete the message",
            error: err.message
        })
    }
}

async function deleteChat(req, res) {
    try{
        const user = req.user;
        const {chatId} = req.body;
        const chat = await chatModel.findById(chatId);
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            })
        }
        const isUserFromChat = chat.participants.some(id =>
            id.toString() === user._id.toString());
        if(!isUserFromChat){
            return res.status(403).json({
                message: "Forbidden: U cannot delete someone else's chat"
            })
        }
        await chatModel.updateOne(
            {_id: chatId},
            {
                $addToSet: {
                    hiddenFor: user._id
                },
            }          
        )
        return res.status(200).json({
            message: "Chat hidden successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to delete chat",
            error: err.message
        })
    }
}

async function loadMessages(req, res) {
    try{
        const user = req.user;
        const {chatId} = req.body;
        const chat = await chatModel.findById(chatId);
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            })
        }
        const isUserParticipant = chat.participants.some(id=>
            id.toString() === user._id.toString()
        )
        if(!isUserParticipant){
            return res.status(403).json({
                message: "Forbidden: Cannot load messages of someone's else chat"
            })
        }
        const userLeftChat = chat.hiddenFor.some(id=>
            id.toString() === user._id.toString()
        );

        if(userLeftChat){
            return res.status(200).json({
                message: "Messages loaded",
                messages: []
            })
        }
        const messages = await messageModel.find({chatId}).sort({createdAt: 1});
  
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

module.exports = {
    findOrCreate,
    deleteMessage,
    deleteChat,
    loadMessages
}