// Global error handling middleware
// Place this at the end of your middleware stack in index.js

const logger = require('./config/logger');

// 404 Error Handler
const notFoundHandler = (req, res, next) => {
    const error = new Error(`Page not found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(statusCode).render('error', {
        title: 'Error',
        statusCode,
        message: isDevelopment ? message : 'Something went wrong',
        stack: isDevelopment ? err.stack : null
    });
};

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    notFoundHandler,
    errorHandler,
    asyncHandler
};