const {Server} = require('socket.io');
const socketAuth = require('./socket.auth');
const registerChatEvents = require('./events/chat.events');

function socketServerConnection(httpServer){
    const io = new Server(httpServer, {
        cors: {origin: "*"}
    });

    io.use(socketAuth);

    io.on("connection", (socket)=>{
        const user = socket.user;
        socket.join(user._id.toString());
        registerChatEvents(io, socket);
    })

    return io;
}

module.exports = socketServerConnection;