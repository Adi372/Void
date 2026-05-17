const {Server} = require('socket.io');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users.model');
const messageModel = require('../models/messages.model');
const chatModel = require('../models/chats.model');

function socketServerConnection(httpServer){
    const io = new Server(httpServer, {});

    io.use(async(socket, next)=>{
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
        if(!cookies.token){
            return next(new Error("Authentication error: No token provided"))
        }
        try{
            const validToken = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(validToken.id);
            if(!user){
                return next(new Error("Authentication error: User not found"))
            }
            socket.user = user;
            return next();
        }
        catch(err){
            console.log("Socket auth error:", err.message)
            return next(new Error(`Socket auth error: ${err.message}`));
        }
    })

    io.on("connection", (socket)=>{
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
                io.to(chatId).emit("receive-message", message, message._id);
            }
            catch(err){
                console.log(err.message);
            }
        })

        socket.on("disconnect", ()=>{
            console.log("Disconnected:", user.username);
        })
    })
    
}

module.exports = socketServerConnection;