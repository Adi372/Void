const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/auth.middleware');
const {
    findOrCreate,
    deleteMessage,
    deleteChat,
    loadMessages,
    allChats
} = require('../controllers/chat.controller');

router.post('/findOrCreate', isLoggedIn, findOrCreate);
router.post('/deleteMessage', isLoggedIn, deleteMessage);
router.post('/deleteChat', isLoggedIn, deleteChat);
router.post('/loadMessages', isLoggedIn, loadMessages);
router.get('/allChats', isLoggedIn, allChats);

module.exports = router;