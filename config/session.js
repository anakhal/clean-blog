// Session configuration for user authentication
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production', 
    resave: false,              // Don't save session if unmodified
    saveUninitialized: false,   // Don't create session until something stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/myDbName',
        touchAfter: 24 * 60 * 60   // 24 hours in seconds (24 * 60 * 60 = 86,400 seconds)
    }),
    cookie: {
        secure: false,          // Set to true in production with HTTPS
        httpOnly: true,         // Prevent XSS attacks
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in milliseconds (7 * 24 * 60 * 60 * 1000 = 604,800,000 ms)
    }
};

module.exports = sessionConfig;