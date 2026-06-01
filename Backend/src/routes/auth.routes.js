const express = require('express');
const router = express.Router();
const {
    register, 
    login, 
    deleteAccount,
    findUser,
    logout
} = require('../controllers/auth.controller');
const isLoggedIn = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/delete', isLoggedIn, deleteAccount);
router.get('/findUser', isLoggedIn, findUser);
router.get('/logout', isLoggedIn, logout);


module.exports = router;