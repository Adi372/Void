const chatModel = require('../../models/chats.model');
const messageModel = require('../../models/messages.model');
const userModel = require('../../models/users.model');

function registerChatEvents(io, socket){
    const user = socket.user;
    console.log("New socket connection: ", socket.id);
    console.log("Connected user: ", user.username);
    socket.on("join-chat", async (chatId)=>{
        try{
            const chat = await chatModel.findById(chatId);
            if(!chat){
                return;
            }
            const isMember = chat.participants.some(id=>
                id.toString() === user._id.toString()
            );
            if(!isMember){
                return;
            }
            socket.join(chatId);
        }
        catch(err){
            return;
        }
    });

    socket.on("send-message", async (data)=>{
        try{
            console.log(data);
            const {chatId, text, participants} = data;
            const chat = await chatModel.findById(chatId);
            if(!chat){
                console.log("Chat not found");
                return;
            }
            const otherUserId = chat.participants.find(id=>
                id.toString() !== user._id.toString()
            );
            const freshUser = await userModel.findById(user._id);
            const stillFriends = freshUser.friends.some(id=>
                id.toString() === otherUserId.toString()
            )
            if(!stillFriends){
                console.log("No longer friends");
                return;
            }

            if(chat.participants.length !== participants.length) return false;
            const a = chat.participants.map(id => id.toString()).sort();
            const b = participants.map(id => id.toString()).sort();
            const sameParticipants = a.every((val, i)=>val === b[i]);
            if(!sameParticipants) {
                console.log("Participants are not same in the chat");
                return;
            };

            const message = await messageModel.create({
                chatId,
                sender: user._id,
                text
            })
            await chatModel.findByIdAndUpdate(chatId, {
                lastMessage: {
                    messageId: message._id,
                    text,
                    sender: user._id,
                    createdAt: message.createdAt
                }
            })
            io.to(chatId).emit("receive-message", message);
        }
        catch(err){
            console.log(err.message);
        }
    })

    socket.on("disconnect", ()=>{
        console.log("Disconnected:", user.username);
    })
}

module.exports = registerChatEvents;