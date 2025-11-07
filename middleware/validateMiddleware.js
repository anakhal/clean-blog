module.exports = (req, res, next) => {
    // Validate title
    if (!req.body.title || req.body.title.trim() === '') {
        return res.status(400).send('Title is required');
    }
    
    // Validate body
    if (!req.body.body || req.body.body.trim() === '') {
        return res.status(400).send('Body content is required');
    }
    
    // Image validation removed - no longer using images
    
    next();
};