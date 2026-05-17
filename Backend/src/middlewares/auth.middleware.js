const userModel = require('../models/users.model');
const jwt = require('jsonwebtoken');

async function isLoggedIn(req, res, next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized: Token not found"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({
                message: "Unauthorized: User not found"
            })
        }
        req.user = user;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
    }
}

module.exports = isLoggedIn;