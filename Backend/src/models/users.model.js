const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
        }
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    interests: [{
        type: String,
        enum: [
            "coding",
            "music",
            "sports",
            "gaming",
            "travel",
            "movies",
            "fitness",
            "photography"
        ]
    }],
    friends:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    sentRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    receivedRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    blockedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    createdPosts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }],
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }],
    comments: [{
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts"
        },
        text: {
            type: String,
            required: true
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }],
    notifications: {
        friendRequestsReceived: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }],
        acceptedRequest: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }],
        likes: [{
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "posts"
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }
        }],
        comments: [{
            post: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "posts"
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }
        }],
    }
}, {timestamps: true});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;