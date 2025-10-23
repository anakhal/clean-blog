// Admin middleware for role-based access control

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/users/login?error=Please login to access this admin feature');
    }
    
    if (req.session.role !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page. Admin privileges required.',
            statusCode: 403
        });
    }
    
    next();
};

// Middleware to check if user is admin (for conditional rendering)
const checkAdmin = (req, res, next) => {
    res.locals.isAdmin = req.session && req.session.role === 'admin';
    next();
};

module.exports = {
    requireAdmin,
    checkAdmin
};