const aiChatModel = require('../../models/AI/aiChat.model');
const aiMsgModel = require('../../models/AI/aiMsg.model');
const { generateResponse, generateVector } = require('../../services/ai.service');
const { createMemory, queryMemory } = require('../../services/vector.service');

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
                role: "user"
            });

            const vectors = await generateVector(message.content);

            console.log("-------------------This is Vectors---------------------")
            console.log(vectors);
            console.log("-------------------------------------------------------")

            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: message.chat,
                    user: user._id.toString(),
                    text: message.content
                }
            })

            const [memory, chatHistory] = await Promise.all([
                queryMemory({
                    queryVector: vectors,
                    limit: 5,
                    metadata: {}
                }),
                aiMsgModel.find({
                    user: user._id,
                    chat: chatId
                }).sort({createdAt: 1}).limit(20)
            ])

            console.log("-------------------This is Memory---------------------")
            console.log(memory);
            console.log("-------------------------------------------------------")


            const shortTermMemory = chatHistory.map(item => {
                return {
                    role: item.role,
                    content: item.content
                }
            })

            const longTermMemory = [
                {
                    role: "user",
                    content: 
                        `
                            These are some previous messages from the chat, use them to generate a response
                            ${memory.map(item=> item.metadata.text).join("\n")}
                        `
                }
            ]

            console.log("-------------------This is Long Term Memory---------------------")
            console.log(JSON.stringify(longTermMemory, null, 2));
            console.log("-------------------------------------------------------")
            console.log("-------------------This is Short Term Memory---------------------");
            console.log(JSON.stringify(shortTermMemory, null, 2));
            console.log("-------------------------------------------------------")

            const response = await generateResponse([...longTermMemory, ...shortTermMemory]);
            
            console.log("-------------------This is Response---------------------")
            console.log(response);
            console.log("----------------------------------------------------------")


            io.to(chatId).emit('ai-response', {
                content: response,
                chat: chat._id
            });

            const [responseMessage, responseVectors] = await Promise.all([
                aiMsgModel.create({
                    user: user._id,
                    chat: chat._id,
                    content: response,
                    role: "assistant"
                }),
                generateVector(response)
            ])

            await aiChatModel.findByIdAndUpdate(chat._id, {
                lastMessage: {
                    text: response,
                    sender: user._id,
                    createdAt: responseMessage.createdAt
                }
            })

            console.log("-------------------This is Response Vectors---------------------")
            console.log(responseVectors);
            console.log("-----------------------------------------------------------------")

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: message.chat,
                    user: user._id.toString(),
                    text: response
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