const rateLimit = require('express-rate-limit');

// Limite stricte pour le login
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 tentatives
    message: 'Too many login attempts from this IP. Please try again in 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Ne compte que les échecs
});

// Limite pour le register
exports.registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    max: 3, // Max 3 enregistrements par IP
    message: 'Too many accounts created from this IP. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
