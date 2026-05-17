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
    }]
}, {timestamps: true});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;