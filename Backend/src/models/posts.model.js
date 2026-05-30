const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    username: {
        type: String
    },
    caption: {
        type: String
    },
    image: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        username: {
            type: String
        },
        text: {
            type: String,
            required: true
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]
}, { timestamps: true });

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;