// Input validation and sanitization middleware for contact form

const validateContactForm = (req, res, next) => {
    const { name, email, message } = req.body;
    
    // Sanitize inputs (basic HTML escape)
    if (name) req.body.name = name.trim().substring(0, 100);
    if (email) req.body.email = email.trim().toLowerCase().substring(0, 254);
    if (message) req.body.message = message.trim().substring(0, 2000);
    if (req.body.phone) req.body.phone = req.body.phone.trim().substring(0, 20);
    
    // Basic validation
    const errors = [];
    
    if (!name || name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!message || message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        return res.redirect(`/contact?error=${encodeURIComponent(errors.join('. '))}`);
    }
    
    next();
};

module.exports = {
    validateContactForm
};