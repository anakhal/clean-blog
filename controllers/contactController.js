const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

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

        let emailSent = false;
        let emailError = null;

        // METHOD 1: SendGrid (Preferred)
        if (process.env.SENDGRID_API_KEY) {
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: process.env.CONTACT_EMAIL || process.env.SMTP_USER, // Where to send the contact form
                from: process.env.SMTP_USER, // Verified Sender Identity
                replyTo: email, // Reply to the user
                subject: `New Contact Form Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f0f0f0; padding: 10px;">${message.replace(/\n/g, '<br>')}</div>
                `,
            };

            try {
                await sgMail.send(msg);
                console.log(`✅ Email sent via SendGrid from ${name}`);
                emailSent = true;
            } catch (error) {
                console.error('❌ SendGrid Error:', error);
                if (error.response) console.error(error.response.body);
                emailError = 'SendGrid Error: ' + error.message;
            }
        }

        // METHOD 2: SMTP (Fallback)
        if (!emailSent && !process.env.SENDGRID_API_KEY) {
            // Create transporter
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: 465, // Force port 465 for Gmail
                secure: true, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
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

            try {
                await transporter.sendMail(mailOptions);
                emailSent = true;
                console.log(`✅ Contact form email sent via SMTP from ${name} (${email})`);
            } catch (emailErr) {
                emailError = emailErr.message;
                console.error('❌ SMTP Error:', emailErr.message);
            }
        }

        // Always save to database as backup
        const contactMessage = new ContactMessage({
            name,
            email,
            phone: phone || null,
            message,
            emailSent,
            emailError
        });

        await contactMessage.save();
        console.log(`💾 Contact message saved to database (ID: ${contactMessage._id})`);

        // Provide appropriate response
        if (emailSent) {
            res.redirect('/contact?success=Thank you! Your message has been sent successfully. We will get back to you soon.');
        } else {
            res.redirect('/contact?success=Thank you! Your message has been received and saved. We will get back to you soon. (Note: Email delivery is temporarily unavailable in our trial environment, but your message is safely stored.)');
        }

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.redirect('/contact?error=Sorry, there was an error processing your message. Please try again later or contact us directly.');
    }
};