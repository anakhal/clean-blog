const axios = require('axios');

exports.verifyRecaptcha = async (req, res, next) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    
    if (!recaptchaResponse) {
        const errorMessage = 'Please complete the reCAPTCHA verification';
        const viewName = req.path.includes('register') ? 'register' : 'login';
        return res.render(viewName, { 
            error: errorMessage,
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
    
    try {
        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
        const response = await axios.post(verifyUrl, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaResponse,
                remoteip: req.ip
            }
        });
        
        if (response.data.success) {
            next();
        } else {
            const errorMessage = 'reCAPTCHA verification failed. Please try again.';
            const viewName = req.path.includes('register') ? 'register' : 'login';
            return res.render(viewName, { 
                error: errorMessage,
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        const errorMessage = 'Verification error. Please try again.';
        const viewName = req.path.includes('register') ? 'register' : 'login';
        return res.render(viewName, { 
            error: errorMessage,
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
};
