const {Server} = require('socket.io');
const socketAuth = require('./socket.auth');
const registerChatEvents = require('./events/chat.events');

let io;

function socketServerConnection(httpServer){
    io = new Server(httpServer, {
        cors: {origin: "*"}
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