const userModel = require('../models/users.model');
const {getIO} = require('../sockets/socket.server');

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

async function sendFriendRequest(req, res) {
    try{
        const io = getIO();
        const user1 = req.user;
        const {user2Id} = req.body;

        const sameUser = user1._id.toString() === user2Id.toString();
        if(sameUser){
            return res.status(400).json({
                message: "You cannot send friend request to yourself"
            })
        }

        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const alreadyFriends = user1.friends.some(id =>
            id.toString() === user2._id.toString()
        )

        if(alreadyFriends){
            return res.status(400).json({
                message: "Already Friends"
            })
        }

        const alreadySent = user1.sentRequest.some(id =>
            id.toString() === user2._id.toString()
        )
        if(alreadySent){
            return res.status(400).json({
                message: "Friend request already sent"
            })
        }

        const alreadyReceived = user1.receivedRequest.some(id=>
            id.toString() === user2._id.toString()
        )

        if(alreadyReceived){
            return res.status(400).json({
                message: "This user already sent you a request"
            })
        }

        const blocked = user1.blockedUser.some(id=>
            id.toString() === user2._id.toString()) 
            || user2.blockedUser.some(id=>
            id.toString() === user1._id.toString());

        if(blocked){
            return res.status(403).json({
                message: "Cannot send request"
            })
        }

        user1.sentRequest.push(user2._id);
        user2.receivedRequest.push(user1._id);
        await user1.save();
        await user2.save();

        const sockets = await io.in(user2._id.toString()).fetchSockets();
        const isOnline = sockets.length>0;

        user2.notifications.friendRequestsReceived.push({
            userId: user1._id,
            username: user1.username,
            fullName: user1.fullName,
        });
        await user2.save();

        if(isOnline){
            io.to(user2._id.toString()).emit("friend-request-received", {
                userId: user1._id,
                username: user1.username,
                fullName: user1.fullName,
                message: "You received a friend request"
            });
        }

        return res.status(200).json({
            message: "Friend request sent",
            sender: user1,
            receiver: user2,
            status: "sent"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to send friend request",
            error: err.message
        })
    }
}

async function acceptFriendRequest(req, res) {
    try{
        const io = getIO();
        const user1 = req.user;
        const {user2Id} = req.body;

        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const requestExists = 
        user1.receivedRequest.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.sentRequest.some(id=> 
            id.toString() === user1._id.toString()
        );

        if(!requestExists){
            return res.status(400).json({
                message: "No friend request found"
            })
        }

        await userModel.findByIdAndUpdate(
            user1._id,
            {
                $addToSet: {
                    friends: user2._id
                },
                $pull: {
                    receivedRequest: user2._id
                }
            }
        )
        await userModel.findByIdAndUpdate(
            user2._id,
            {
                $addToSet: {
                    friends: user1._id
                },
                $pull: {
                    sentRequest: user1._id
                }
            }
        )

        const sockets = await io.in(user2._id.toString()).fetchSockets();
        const isOnline = sockets.length > 0;

        user2.notifications.acceptedRequest.push({
            userId: user1._id,
            username: user1.username,
            fullName: user1.fullName
        });
        await user2.save();
            
        if(isOnline){
            io.to(user2._id.toString()).emit("friend-request-accepted", {
                userId: user1._id,
                username: user1.username,
                fullName: user1.fullName,
                message: "Friend request accepted"
            })
        }

        return res.status(200).json({
            message: "Friend request accepted",
            sender: user2,
            receiver: user1,
            status: "accepted"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to accept request",
            error: err.message
        })
    }
}

async function removeFriend(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;
        
        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const isFriend = 
        user1.friends.some(id =>
            id.toString() === user2._id.toString()
        ) && 
        user2.friends.some(id =>
            id.toString() === user1._id.toString()
        )

        if(!isFriend){
            return res.status(400).json({
                message: "You are already not friend with this user"
            })
        }

        user1.friends.pull(user2._id);
        user2.friends.pull(user1._id);

        await user1.save();
        await user2.save();

        return res.status(200).json({
            message: "Removed friend successfully",
            sender: user1,
            receiver: user2,
            status: "unsent"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to remove friend",
            error: err.message
        })
    }
}

async function unsendFriendRequest(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;
        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const requestExists = 
        user1.sentRequest.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.receivedRequest.some(id=> 
            id.toString() === user1._id.toString()
        );
        if(!requestExists){
            return res.status(400).json({
                message: "No friend request found"
            })
        }
        user1.sentRequest.pull(user2._id);
        user2.receivedRequest.pull(user1._id);
        await user1.save();
        await user2.save();
        return res.status(200).json({
            message: "Your friend request was cancelled successfully",
            message: "Friend request unsent",
            sender: user1,
            receiver: user2,
            status: "unsent"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to unsend Friend Request"
        })
    }
}

async function rejectFriendRequest(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;
        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const requestExists = 
        user1.receivedRequest.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.sentRequest.some(id=> 
            id.toString() === user1._id.toString()
        );

        if(!requestExists){
            return res.status(400).json({
                message: "No friend request found"
            })
        }
        user1.receivedRequest.pull(user2._id);
        user2.sentRequest.pull(user1._id);
        await user1.save();
        await user2.save();
        return res.status(200).json({
            message: "Rejected incoming friend request successfully",
            sender: user2,
            receiver: user1,
            status: "unsent"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to reject incoming friend request",
            error: err.message
        })
    }
}

async function blockUser(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;

        const sameUser = user1._id.toString() === user2Id.toString();
        if(sameUser){
            return res.status(400).json({
                message: "You cannot block/unblock yourself"
            })
        }

        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const alreadyBlocked = user1.blockedUser.some(id=>
            id.toString() === user2._id.toString())
        if(alreadyBlocked){
            return res.status(400).json({
                message: "User already blocked"
            })
        }
        const isFriend = 
        user1.friends.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.friends.some(id=>
            id.toString() === user1._id.toString()
        );

        if(isFriend){
            user1.friends.pull(user2._id);
            user2.friends.pull(user1._id);
            await user1.save();
            await user2.save();
        }
        const sentRequest = 
        user1.sentRequest.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.receivedRequest.some(id=>
            id.toString() === user1._id.toString()
        )
        if(sentRequest){
            user1.sentRequest.pull(user2._id);
            user2.receivedRequest.pull(user1._id);
            await user1.save();
            await user2.save();
        }
        const receivedRequest = 
        user1.receivedRequest.some(id=>
            id.toString() === user2._id.toString()
        ) &&
        user2.sentRequest.some(id=>
            id.toString() === user1._id.toString()
        );
        if(receivedRequest){
            user1.receivedRequest.pull(user2._id);
            user2.sentRequest.pull(user1._id);
            await user1.save();
            await user2.save()
        }
        user1.blockedUser.push(user2._id);
        await user1.save();
        return res.status(200).json({
            message: "User blocked successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to block user"
        })
    }
}

async function unblockUser(req, res) {
    try{
        const user1 = req.user;
        const {user2Id} = req.body;

        const sameUser = user1._id.toString() === user2Id.toString();
        if(sameUser){
            return res.status(400).json({
                message: "You cannot block/unblock yourself"
            })
        }

        const user2 = await userModel.findById(user2Id);
        if(!user2){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const alreadyBlocked = user1.blockedUser.some(id=>
            id.toString() === user2._id.toString())
        if(!alreadyBlocked){
            return res.status(400).json({
                message: "User already unblocked"
            })
        }
        user1.blockedUser.pull(user2._id);
        await user1.save();
        return res.status(200).json({
            message: "User unblocked successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to unblock user"
        })
    }
}

async function clearNotifications(req, res) {
    try{
        const user = req.user;
        user.notifications = {
            friendRequestsReceived: [],
            acceptedRequest: [],
            likes: [],
            comments: []
        };
        await user.save();
        res.status(200).json({
            message: "Notifications cleared"
        });
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

async function accountSuggestions(req, res) {
    try{
        const user = req.user;
        const interests = user.interests;
        const similarInterests = await userModel.aggregate([
            {
                $match: {
                    interests: {$in: user.interests},
                    _id: {$ne: user._id}
                }
            },
            {
                $sample: {size: 10}
            },
            {
                $project: {
                    fullName: 1,
                    username: 1,
                    email: 1,
                    interests: 1,
                    friends: 1,
                    createdPosts: 1,
                }
            }
        ]);

        return res.status(200).json({
            message: "Fetched all acounts who have similar interests",
            accountWithSimilarInterests: similarInterests
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to load suggestions",
            errro: err.message
        })
    }
}

async function allUsers (req, res){
    try{
        const users = await userModel.find().sort({createdAt: -1});
        return res.status(200).json({
            message: "All users fetched",
            users
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to load all users",
            errro: err.message
        })
    }
}

async function searchOneUser (req, res){
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        return res.status(200).json({
            message: "User fetched",
            user
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to load the user",
            error: err.message
        })
    }
}
module.exports = {
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    unsendFriendRequest,
    rejectFriendRequest,
    clearNotifications,
    accountSuggestions,
    allUsers,
    searchOneUser
}