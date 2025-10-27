const nodemailer = require('nodemailer');

// GET /contact - Show contact form
exports.showContact = (req, res) => {
    res.render('contact', {
        title: 'Contact Us',
        error: req.query.error || null,
        success: req.query.success || null
    });
};

// POST /contact - Handle contact form submission
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.redirect('/contact?error=Please fill in all required fields (name, email, message)');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.redirect('/contact?error=Please enter a valid email address');
        }
        
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER ,
                pass: process.env.SMTP_PASS
            },
             connectionTimeout: 30000,
    socketTimeout: 30000,
    greetingTimeout: 15000,
    tls: {
        rejectUnauthorized: false
    }
        });
        
        // Email content
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
            subject: `New Contact Form Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0085A1;">New Contact Form Submission</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0085A1;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p style="color: #6c757d; font-size: 14px;">
                        This message was sent from the contact form on your Clean Blog website.
                    </p>
                </div>
            `,
            text: `
                New Contact Form Submission
                
                Name: ${name}
                Email: ${email}
                Phone: ${phone || 'Not provided'}
                
                Message:
                ${message}
                
                This message was sent from the contact form on your Clean Blog website.
            `
        };
        
        // Send auto-reply to sender
        const autoReplyOptions = {
            from: `"Clean Blog" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Thank you for contacting us!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0085A1;">Thank you for your message!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Your message:</strong></p>
                        <div style="background: white; padding: 15px; border-radius: 4px;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    <p>Best regards,<br>The Clean Blog Team</p>
                </div>
            `
        };
        
        // Send emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReplyOptions);
        
        console.log(`Contact form message sent from ${name} (${email})`);
        
        res.redirect('/contact?success=Thank you! Your message has been sent successfully. We will get back to you soon.');
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.redirect('/contact?error=Sorry, there was an error sending your message. Please try again later.');
    }
};