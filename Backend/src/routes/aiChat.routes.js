const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/auth.middleware');
const {findOrCreate} = require('../controllers/aiChat.controller');

router.post('/findOrCreate', isLoggedIn, findOrCreate);

module.exports = router;