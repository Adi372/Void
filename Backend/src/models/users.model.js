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
            "Technology","Music","Sports","Gaming","Travel",
            "Movies & TV","Fitness","Photography","Food",
            "Fashion","Art & Design","Business","Education",
            "Science","Books","Lifestyle","Creators","Anime",
            "Memes","News"
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
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            username: {
                type: String
            },
            fullName: {
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        acceptedRequest: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            username: {
                type: String
            },
            fullName: {
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        likes: [{
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "posts"
            },
            postCaption: {
                type: String
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            username: {
                type: String
            },
            fullName: {
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        comments: [{
            comment: {
                type: String
            },
            postId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "posts"
            },
            postCaption: {
                type: String
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            },
            username: {
                type: String
            },
            fullName: {
                firstName: {
                    type: String,
                },
                lastName: {
                    type: String,
                }
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
    }
}, {timestamps: true});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;