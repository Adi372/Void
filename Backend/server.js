require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/db/db');
const socketServer = require('./src/sockets/socket.server');

connectToDB();

const httpServer = app.listen(3000, ()=>{
    console.log("Server running at port 3000");
})

socketServer(httpServer);