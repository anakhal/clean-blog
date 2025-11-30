const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyRecaptcha } = require("../middleware/recaptchaMiddleware");
const {
    loginLimiter,
    registerLimiter,
} = require("../middleware/authRateLimiter");

// Conditionally disable reCAPTCHA in development
const isDevelopment = process.env.NODE_ENV !== "production";
const recaptchaMiddleware = isDevelopment
    ? (req, res, next) => next()
    : verifyRecaptcha;

// GET /users/register
router.get("/register", userController.showRegister);

// POST /users/register - With reCAPTCHA protection and rate limiting
router.post(
    "/register",
    registerLimiter,
    recaptchaMiddleware,
    userController.register,
);

// GET /users/login
router.get("/login", userController.showLogin);

// POST /users/login - With reCAPTCHA protection and rate limiting
router.post("/login", loginLimiter, recaptchaMiddleware, userController.login);

// POST /users/logout
router.post("/logout", userController.logout);

module.exports = router;
