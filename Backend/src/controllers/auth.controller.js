const userModel = require('../models/users.model');
const postModel = require('../models/posts.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res){
    try{
        const {
            fullName: {firstName, lastName}, 
            username, 
            email, 
            password,
            interests
        } = req.body;

        const checkUsername = await userModel.findOne({username});
        const checkEmail = await userModel.findOne({email});

        if(checkUsername || checkEmail){
            return res.status(409).json({
                message: "Email or Username already exists"
            })
        }
        const user = await userModel.create({
            fullName: {
                firstName,
                lastName
            },
            username,
            email,
            password: await bcrypt.hash(password, 10),
            interests: interests,
            createdPosts:[],
            likedPosts: [],
            comments: [],
            shares: [],
            savedPosts: []
        })
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });
        return res.status(201).json({
            message: "User created successfully",
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            interests: interests
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

async function login(req, res) {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Wrong Email or Password"
            })
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword){
            return res.status(401).json({
                message: "Wrong Email or Password"
            })
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });
        return res.status(200).json({
            message: "User loggedin successfully",
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

async function deleteAccount(req, res) {
    try{
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        if(!userAccount){
            return res.status(404).json({
                message: "Account doesn't exist"
            })
        }
        // Get all my posts
        const userPosts = await postModel.find({user: user._id});

        //Get id's of all my posts
        const postIds = userPosts.map(p => p._id);

        // Remove the other people's likes and comments on my post from their profile
        // && remove my id from their friends, blocked user, every request
        await userModel.updateMany(
            {},
            {
                $pull: {
                    likedPosts: {$in: postIds},
                    comments: {post: {$in: postIds}},
                    savedPosts: {$in: postIds},
                    friends: user._id,
                    sentRequest: user._id,
                    receivedRequest: user._id,
                    blockedUser: user._id
                }
            }
        )
        
        //Remove likes and comments made by me on other posts
        await postModel.updateMany(
            {},
            {   
                $pull: {
                    comments: {user: user._id},
                    likes: user._id,
                    saves: user._id
                } 
            }
        )
        
        await postModel.deleteMany({user: user._id});

        await userModel.findByIdAndDelete(user._id);
        return res.status(200).json({
            message: "Account and all posts deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to delete account",
            error: err.message
        })
    }
}

async function findUser(req, res) {
    try{
        const userId = req.user._id;
        const user = await userModel.findById(userId);
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {
    register,
    login,
    deleteAccount,
    findUser
}