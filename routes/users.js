const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User registration routes
router.get('/register', userController.showRegister);
router.post('/register', userController.register);

// User login routes
router.get('/login', userController.showLogin);
router.post('/login', userController.login);

// User logout route
router.post('/logout', userController.logout);

module.exports = router;