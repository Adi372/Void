const express = require('express');
const router = express.Router();
const {searchUser} = require('../controllers/user.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

router.post('/searchUser', isLoggedIn, searchUser);

module.exports = router;