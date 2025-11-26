const axios = require('axios');

exports.verifyRecaptcha = async (req, res, next) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];

    if (!recaptchaResponse) {
        const errorMessage = 'reCAPTCHA verification failed. Please try again.';
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

        // Diagnostic logging (do not log secrets)
        console.log('reCAPTCHA v3 verification result:', {
            success: response.data.success,
            score: response.data.score,
            action: response.data.action,
            hostname: response.data.hostname,
            'error-codes': response.data['error-codes']
        });

        // Attach verification result to request for controllers
        req.recaptcha = response.data;

        if (response.data.success) {
            // v3 score check - 0.5 is recommended threshold
            const score = response.data.score || 0;
            const threshold = 0.5;

            if (score >= threshold) {
                console.log(`reCAPTCHA passed with score: ${score}`);
                next();
            } else {
                console.log(`reCAPTCHA score too low: ${score} (threshold: ${threshold})`);
                const errorMessage = 'reCAPTCHA verification failed. Please try again.';
                const viewName = req.path.includes('register') ? 'register' : 'login';
                return res.render(viewName, {
                    error: errorMessage,
                    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
                });
            }
        } else {
            const errorMessage = 'reCAPTCHA verification failed. Please try again.';
            const viewName = req.path.includes('register') ? 'register' : 'login';
            return res.render(viewName, {
                error: errorMessage,
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error.message);
        const errorMessage = 'Verification error. Please try again.';
        const viewName = req.path.includes('register') ? 'register' : 'login';
        return res.render(viewName, {
            error: errorMessage,
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    }
};
