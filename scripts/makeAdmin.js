require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const user = await User.findOneAndUpdate(
            { username: 'nakhal69' },
            { role: 'admin' },
            { new: true }
        );
        
        if (user) {
            console.log(`✅ ${user.username} is now admin!`);
        } else {
            console.log('❌ User not found');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

makeAdmin();
