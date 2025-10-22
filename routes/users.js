const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, redirectIfAuth } = require('../middleware/authMiddleware');

// User registration routes - redirect if already logged in
router.get('/register', redirectIfAuth, userController.showRegister);
router.post('/register', redirectIfAuth, userController.register);

// User login routes - redirect if already logged in  
router.get('/login', redirectIfAuth, userController.showLogin);
router.post('/login', redirectIfAuth, userController.login);

// User logout route - require authentication
router.post('/logout', requireAuth, userController.logout);

module.exports = router;