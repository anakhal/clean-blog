const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyRecaptcha } = require('../middleware/recaptchaMiddleware');
const { loginLimiter, registerLimiter } = require('../middleware/authRateLimiter');

// GET /users/register
router.get('/register', userController.showRegister);

// POST /users/register - Avec protection reCAPTCHA et rate limiting
router.post('/register', registerLimiter, verifyRecaptcha, userController.register);

// GET /users/login
router.get('/login', userController.showLogin);

// POST /users/login - Avec protection reCAPTCHA et rate limiting
router.post('/login', loginLimiter, verifyRecaptcha, userController.login);

// POST /users/logout
router.post('/logout', userController.logout);

module.exports = router;