const {Server} = require('socket.io');
const socketAuth = require('./socket.auth');
const registerChatEvents = require('./events/chat.events');
const { registerAIChatEvents } = require('./events/aiChat.event');

let io;

function socketServerConnection(httpServer){
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.use(socketAuth);

    io.on("connection", (socket)=>{
        const user = socket.user;
        if(!user){
            socket.disconnect();
            return;
        }
        socket.join(user._id.toString());
        registerChatEvents(io, socket);
        registerAIChatEvents(io, socket);
    })

    return io;
}

function getIO(){
    if(!io) throw new Error("Socket not initialized");
    return io;
}

module.exports = {
    socketServerConnection,
    getIO
};