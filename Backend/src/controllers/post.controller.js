const postModel = require('../models/posts.model');
const userModel = require('../models/users.model');
const {getIO} = require('../sockets/socket.server')
const uploadFile = require('../services/storage.service');
const {v4: uuidv4} = require('uuid');

async function create(req, res) {
    try{
        const user = req.user;

        const file = req.file;
        const base64Image = file.buffer.toString('base64');
        const uploadImage = await uploadFile(file.buffer, `${uuidv4()}`);
        const {caption} = req.body;
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        const post  = await postModel.create({
            user: user._id,
            caption: caption,
            image: uploadImage,
            username: user.username,
            likes: [],
            profilePic: user.profilePic
        })
        const userAccount = await userModel.findById(user._id);
        userAccount.createdPosts.push(post._id);
        await userAccount.save();
        return res.status(201).json({
            message: "Post created successfully",
            post
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        });
    }
}

async function deletePost(req, res) {
    try{
        const user = req.user;
        const {postId} = req.body;
        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({
                message: "Post doesn't exists"
            })
        }
        if(post.user.toString() !== user._id.toString()){
            return res.status(403).json({
                message: "Unauthorized to delete this post"
            })
        }
        const userAccount = await userModel.findById(user._id);
        if (!userAccount) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await userModel.updateMany(
            {},
            {
                $pull: {
                    likedPosts: post._id,
                    comments: {post: post._id},
                    savedPosts: post._id
                }
            }
        )

        await postModel.findByIdAndDelete(postId);
        userAccount.createdPosts.pull(postId);
        await userAccount.save();
        return res.status(200).json({
            message: "Post deleted successfully",
            postsInUserProfileLength: userAccount.createdPosts.length,
            postsInUserProfile: userAccount.createdPosts,
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to delete the post",
            error: err.message
        })
    }
}

async function allPosts(req, res) {
    try{
        const posts = await postModel.find().sort({createdAt: -1});
        return res.status(200).json({
            message: "All posts fetched",
            posts
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to fetch posts",
            error: err.message
        })
    }
}

async function userPosts(req, res){
    try{
        const {userId} = req.body;
        const posts = await postModel.find({user: userId}).sort({createdAt: -1});
        return res.status(200).json({
            message: "All user posts fetched",
            posts
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to fetch posts",
            error: err.message
        });
    }
}

async function myPosts(req, res) {
    try{
        const user = req.user;
        const posts = await postModel.find({user: user._id}).sort({createdAt: -1});
        return res.status(200).json({
            message: "All your posts fetched",
            posts
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to fetch posts",
            error: err.message
        });
    }
}

async function like(req, res) {
    try{
        const io = getIO();
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        const {post} = req.body;
        const likedPost = await postModel.findById(post);
        
        if(!likedPost){
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const alreadyLiked = likedPost.likes.some(
            id => id.toString() === userAccount._id.toString()
        );

        if(alreadyLiked){
            return res.status(400).json({
                message: "Post already liked"
            })
        }

        userAccount.likedPosts.push(likedPost._id);
        likedPost.likes.push(user._id);

        await userAccount.save();
        await likedPost.save();

        const user2 = await userModel.findById(likedPost.user);
        if(user2._id.toString() !== user._id.toString()){
            const sockets = await io.in(user2._id.toString()).fetchSockets();
            const isOnline = sockets.length > 0;

            user2.notifications.likes.push({
                postId: likedPost._id,
                postCaption: likedPost.caption,
                userId: user._id,
                profilePic: user.profilePic,
                username: user.username,
                fullName: user.fullName,
            })                
            await user2.save();

            if(isOnline){
                io.to(user2._id.toString()).emit("liked-post", {
                    userId: user._id,
                    profilePic: user.profilePic,
                    username: user.username,
                    fullName: user.fullName,
                    postId: likedPost._id,
                    postCaption: likedPost.caption,
                    message: "Your post got a like",
                    createdAt: new Date()
                })
            }
        }

        return res.status(200).json({
            message: "The like to post was added successfully",
            userWhoLiked: userAccount._id,
            postGotLiked: likedPost._id,
            totalLikesLength: likedPost.likes.length,
            totalLikes: likedPost.likes
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to add the like to the post",
            error: err.message
        })
    }
}

async function removeLike(req, res) {
    try{
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        const {post} = req.body;
        const likedPost = await postModel.findById(post);

        if(!likedPost){
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const likeExists = likedPost.likes.some(id=>
            id.toString() === userAccount._id.toString()
        )
        if(!likeExists){
            return res.status(409).json({
                message: "Post is not liked yet"
            })
        }
        likedPost.likes.pull(userAccount._id);
        userAccount.likedPosts.pull(likedPost._id);
        await likedPost.save();
        await userAccount.save();

        return res.status(200).json({
            message: "Like removed successfully",
            postUnliked: likedPost._id,
            totalLikesLength: likedPost.likes.length,
            totalLikes: likedPost.likes
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to remove like from the post",
            error: err.message
        })
    }
}

async function comment(req, res) {
    try{
        const io = getIO();
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        const {postId, comment} = req.body;
        const commentedPost = await postModel.findById(postId);

        if(!commentedPost){
            return res.status(404).json({
                message: "Post not found"
            })
        }

        commentedPost.comments.push({user: userAccount._id, username: userAccount.username, text: comment, profilePic: userAccount.profilePic});
        userAccount.comments.push({post: commentedPost._id, text: comment});

        await commentedPost.save();
        await userAccount.save();

        const user2 = await userModel.findById(commentedPost.user);
        if(user2._id.toString() !== user._id.toString()){
            const sockets = await io.in(user2._id.toString()).fetchSockets();
            const isOnline = sockets.length > 0;

            user2.notifications.comments.push({
                comment,
                postId: commentedPost._id,
                postCaption: commentedPost.caption,
                userId: user._id,
                profilePic: user.profilePic,
                username: user.username,
                fullName: user.fullName,
            })
            await user2.save();

            if(isOnline){
                io.to(user2._id.toString()).emit("commented", {
                    userId: user._id,
                    profilePic: user.profilePic,
                    username: user.username,
                    fullName: user.fullName,
                    postId: commentedPost._id,
                    postCaption: commentedPost.caption,
                    comment: comment,
                    message: "Your post got a comment",
                    createdAt: new Date()
                });
            }
        }

        return res.status(201).json({
            message: "Comment added successfully",
            CommenterId: userAccount._id,
            CommenterUsername: userAccount.username,
            postGotComment: commentedPost._id,
            totalCommentsLength: commentedPost.comments.length,
            totalComments: commentedPost.comments
        })

    }
    catch(err){
        return res.status(500).json({
            message: "Failed to add the comment to the post",
            error: err.message
        })
    }
}

async function removeComment(req, res) {
    try{
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        const {postId, comment, commentId} = req.body;
        const commentedPost = await postModel.findById(postId);

        if(!commentedPost){
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const commentExistsinPost = commentedPost.comments.some(c =>
            c._id.toString() === commentId.toString()
        )
        
        if(!commentExistsinPost){
            return res.status(404).json({
                message: "Comment not yet added"
            })
        }

        const commentIdInUser = userAccount.comments.find(
            c =>
                c.post.toString() === postId && c.text === comment
        );

        if(!commentIdInUser){
            return res.status(404).json({
                message: "Comment not found in user's profile"
            })
        }

        commentedPost.comments = commentedPost.comments.filter(
            c =>
                !(
                    c._id.toString() === commentId.toString()
                )
        )

        userAccount.comments = userAccount.comments.filter(
            c =>
                !(
                    c._id.toString() === commentIdInUser._id.toString()
                )
        )

        await commentedPost.save();
        await userAccount.save();

        return res.status(200).json({
            message: "Comment removed successfully",
            uncommentedPost: commentedPost._id,
            totalCommentsLength: commentedPost.comments.length,
            totalComments: commentedPost.comments
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to remove the comment from the post",
            error: err.message
        })
    }
}

async function save(req, res) {
    try{
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        if(!userAccount){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const {postId} = req.body;
        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            })
        }
        const alreadySaved = 
            post.saves.some(id=> id.toString() === user._id.toString()) && 
            userAccount.savedPosts.some(id=> id.toString() === post._id.toString());
        if(alreadySaved){
            return res.status(400).json({
                message: "Post already saved"
            })
        }
        post.saves.push(user._id);
        userAccount.savedPosts.push(post._id);
        await post.save();
        await userAccount.save();
        return res.status(200).json({
            message: "Saved post successfully",
            savedPost: post._id,
            userwhoSaved: user._id,
            totalSaves: post.saves.length
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to save the post",
            error: err.message
        })
    }
}

async function unsave(req, res) {
    try{
        const user = req.user;
        const userAccount = await userModel.findById(user._id);
        if(!userAccount){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const {postId} = req.body;
        const post = await postModel.findById(postId);
        if(!post){
            return res.status(404).json({
                message: "Post not found"
            })
        }
        const alreadySaved = 
        post.saves.some(id=> id.toString() === user._id.toString()) &&
        userAccount.savedPosts.some(id => id.toString() === post._id.toString());

        if(!alreadySaved){
            return res.status(409).json({
                message: "Post already unsaved"
            })
        }

        post.saves.pull(user._id);
        userAccount.savedPosts.pull(post._id);

        await post.save();
        await userAccount.save();

        return res.status(200).json({
            message: "Post unsaved successfully",
            unsavedPost: post._id,
            userWhoUnsaved: user._id,
            totalSaves: post.saves.length
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to unsave the post",
            error: err.message
        })
    }
}

async function likedPosts(req, res){
    try{
        const user = req.user;
        
        const likedPosts = await postModel.find({
            likes: user._id
        })
        return res.status(200).json({
            message: "All your likedPosts fetched",
            likedPosts
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Failed to fetch likedPosts",
            error: err.message
        })
    }
}

async function commentedPosts(req, res) {
    try {
        const user = req.user;

        const commentedPosts = await postModel.find({
            "comments.user": user._id
        });

        return res.status(200).json({
            message: "All your commented posts fetched",
            commentedPosts
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Failed to fetch commented posts",
            error: err.message
        });
    }
}

async function savedPosts(req, res) {
    try {
        const user = req.user;

        const savedPosts = await postModel.find({
            saves: user._id
        });

        return res.status(200).json({
            message: "All your saved posts fetched",
            savedPosts
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Failed to fetch saved posts",
            error: err.message
        });
    }
}

module.exports = {
    create,
    deletePost,
    allPosts,
    myPosts,
    like,
    comment,
    removeLike,
    removeComment,
    save,
    unsave,
    userPosts,
    likedPosts,
    commentedPosts,
    savedPosts
}