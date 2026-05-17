const userModel = require('../models/users.model');

async function searchUser(req, res) {
    try{
        const user = req.user;
        const {name} = req.body;

        const users = await userModel.find({
            $or: [
                {
                    username: {
                        $regex: name,
                        $options: "i"
                    }
                },
                {
                    "fullName.firstName": {
                        $regex: name,
                        $options: "i"
                    }
                },
                {
                    "fullName.lastName": {
                        $regex: name,
                        $options: "i"
                    }
                }
            ]
        }).select("username fullName createdPosts").sort({ username: 1 });;

        if(users.length === 0){
            return res.status(404).json({
                message: "No users found"
            })
        }
        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to search",
            error: err.message
        })
    }
}

module.exports = {
    searchUser
}