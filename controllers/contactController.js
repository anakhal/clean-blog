const ContactMessage = require("../models/ContactMessage");

// GET /contact - Show contact form
exports.showContact = (req, res) => {
    res.render("contact", {
        title: "Contact Us",
        error: req.query.error || null,
        success: req.query.success || null,
        showAds: false,
    });
};

// POST /contact - Handle contact form submission
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.redirect(
                "/contact?error=Please fill in all required fields (name, email, message)",
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.redirect(
                "/contact?error=Please enter a valid email address",
            );
        }

        let emailSent = false;
        let emailError = null;

        // Send email via SendGrid
        if (!process.env.SENDGRID_API_KEY) {
            console.error(
                "❌ SENDGRID_API_KEY not configured in environment variables",
            );
            emailError = "SendGrid not configured";
        } else {
            const sgMail = require("@sendgrid/mail");
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            const msg = {
                to: process.env.CONTACT_EMAIL, // Where to send the contact form
                from: process.env.CONTACT_EMAIL, // Verified Sender Identity (must be verified in SendGrid)
                replyTo: email, // Reply to the user who submitted the form
                subject: `New Contact Form Message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\n\nMessage:\n${message}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0085A1;">New Contact Form Submission</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                            <p><strong>Message:</strong></p>
                            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #0085A1;">
                                ${message.replace(/\n/g, "<br>")}
                            </div>
                        </div>
                        <p style="color: #6c757d; font-size: 14px;">
                            This message was sent from the contact form on mathematiques-bac.org
                        </p>
                    </div>
                `,
            };

            try {
                await sgMail.send(msg);
                console.log(
                    `✅ Email sent via SendGrid from ${name} (${email})`,
                );
                emailSent = true;
            } catch (error) {
                console.error("❌ SendGrid Error:", error);
                if (error.response) {
                    console.error("SendGrid Response:", error.response.body);
                }
                emailError = error.message;
            }
        }

        // Always save to database as backup
        const contactMessage = new ContactMessage({
            name,
            email,
            phone: phone || null,
            message,
            emailSent,
            emailError,
        });

        await contactMessage.save();
        console.log(
            `💾 Contact message saved to database (ID: ${contactMessage._id})`,
        );

        // Provide appropriate response
        if (emailSent) {
            res.redirect(
                "/contact?success=Thank you! Your message has been sent successfully. We will get back to you soon.",
            );
        } else {
            res.redirect(
                "/contact?success=Thank you! Your message has been received and saved. We will respond as soon as possible.",
            );
        }
    } catch (error) {
        console.error("❌ Contact form error:", error);
        res.redirect(
            "/contact?error=Sorry, there was an error processing your message. Please try again later.",
        );
    }
};
