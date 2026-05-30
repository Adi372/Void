const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/auth.middleware');
const {
    findOrCreate,
    loadAIMessages
} = require('../controllers/aiChat.controller');

router.get('/findOrCreate', isLoggedIn, findOrCreate);
router.post('/loadAIMessages', isLoggedIn, loadAIMessages);

module.exports = router;