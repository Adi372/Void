const express = require('express');
const isLoggedIn = require('../middlewares/auth.middleware');
const {
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
} = require('../controllers/post.controller')

const router = express.Router();

router.post('/create', isLoggedIn, create);
router.post('/deletePost', isLoggedIn, deletePost);
router.get('/allPosts', isLoggedIn, allPosts);
router.get('/myPosts', isLoggedIn, myPosts);
router.post('/like', isLoggedIn, like);
router.post('/comment', isLoggedIn, comment);
router.post('/removeLike', isLoggedIn, removeLike);
router.post('/removeComment', isLoggedIn, removeComment);
router.post('/save', isLoggedIn, save);
router.post('/unsave', isLoggedIn, unsave);
router.post('/userPosts', isLoggedIn, userPosts);
router.get('/likedPosts', isLoggedIn, likedPosts);
router.get('/commentedPosts', isLoggedIn, commentedPosts);
router.get('/savedPosts', isLoggedIn, savedPosts);

module.exports = router;