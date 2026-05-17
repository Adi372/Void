const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users.model');

module.exports = async (socket, next) => {
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
};