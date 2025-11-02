const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    message: {
        type: String,
        required: true
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    emailError: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
module.exports = ContactMessage;
