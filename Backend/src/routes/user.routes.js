const express = require('express');
const router = express.Router();
const {
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
    searchOneUser,
    allFriends,
    updateInterests
    } 
    = require('../controllers/user.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

router.post('/searchUser', isLoggedIn, searchUser);
router.post('/sendFriendRequest', isLoggedIn, sendFriendRequest);
router.post('/acceptFriendRequest', isLoggedIn, acceptFriendRequest);
router.post('/removeFriend', isLoggedIn, removeFriend);
router.post('/blockUser', isLoggedIn, blockUser);
router.post('/unblockUser', isLoggedIn, unblockUser);
router.post('/unsendFriendRequest', isLoggedIn, unsendFriendRequest);
router.post('/rejectFriendRequest', isLoggedIn, rejectFriendRequest);
router.get('/clearNotifications', isLoggedIn, clearNotifications);
router.get('/similarAccounts', isLoggedIn, accountSuggestions);
router.get('/allUsers', isLoggedIn, allUsers);
router.post('/searchOneUser', isLoggedIn, searchOneUser);
router.get('/allFriends', isLoggedIn, allFriends);
router.post('/updateInterests', isLoggedIn, updateInterests);

module.exports = router;