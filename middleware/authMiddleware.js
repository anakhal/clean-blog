// Authentication middleware to check if user is logged in

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        // User is authenticated, continue to next middleware/route
        return next();
    } else {
        // User is not authenticated, redirect to login
        return res.redirect('/users/login?error=Please login to access this page');
    }
};

// Middleware to check authentication status (for conditional rendering)
const checkAuth = (req, res, next) => {
    // Make user info available to all templates
    res.locals.user = null;
    res.locals.isLoggedIn = false;
    
    if (req.session && req.session.isLoggedIn) {
        res.locals.user = {
            id: req.session.userId,
            username: req.session.username
        };
        res.locals.isLoggedIn = true;
       
    }
    
    next();
};

// Middleware to redirect authenticated users away from login/register pages
const redirectIfAuth = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        return res.redirect('/?info=You are already logged in');
    }
    next();
};
module.exports = {
    requireAuth,
    checkAuth,
    redirectIfAuth
};