const aiChatModel = require('../../models/AI/aiChat.model');
const aiMsgModel = require('../../models/AI/aiMsg.model');
const { generateResponse } = require('../../services/ai.service');

function registerAIChatEvents(io, socket){
    const user = socket.user;
    console.log("New socket connection: ", socket.id);
    console.log("Connected user: ", user.username);

    socket.on("join-aiChat", async(chatId)=>{
        try{
            const chat = await aiChatModel.findById(chatId);
            if(!chat){
                return;
            }
            const isMember = chat.user.toString() === user._id.toString();
            if(!isMember){
                return;
            }
            socket.join(chatId)
        }
        catch(err){
            return;
        }
    })

    socket.on("user-response", async(data)=>{
        try{
            console.log(data);
            const {chatId, content} = data;
            const chat = await aiChatModel.findById(chatId);
            if(!chat){
                console.log("Chat not found");
                return;
            }
            let message = await aiMsgModel.create({
                user: user._id,
                chat: chatId,
                content,
                role: "human"
            });

            await aiChatModel.findByIdAndUpdate(chat._id, {
                lastMessage: {
                    text: message.content,
                    sender: user._id,
                    createdAt: message.createdAt
                }
            })

            const messages = await aiMsgModel.find({
                user: user._id,
                chat: chatId
            }).sort({createdAt: 1});


            const history = messages.map(item => ({
                role: item.role,
                content: item.content
            }))

            console.log(history);

            const response = await generateResponse(history);
            console.log(response);

            io.to(chatId).emit('ai-response', {
                content: response,
                chat: chat._id
            });

            await aiMsgModel.create({
                user: user._id,
                chat: chat._id,
                content: response,
                role: "ai"
            });

            await aiChatModel.findByIdAndUpdate(chat._id, {
                lastMessage: {
                    text: response,
                    sender: user._id,
                    createdAt: message.createdAt
                }
            })
        }
        catch(err){
            console.log(err);
            socket.emit("ai-error", {
                message: "Something went wrong"
            });
        }
    });
}

module.exports = {
    registerAIChatEvents
}