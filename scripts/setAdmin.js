const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Security check - only allow in development
if (process.env.NODE_ENV === 'production') {
    console.log('❌ This script is disabled in production for security');
    process.exit(1);
}

async function setUserAsAdmin(username) {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Find the user
        console.log(`Looking for user: ${username}`);
        const user = await User.findOne({ username: username });
        
        if (!user) {
            console.log(`❌ User '${username}' not found`);
            console.log('Available users:');
            const allUsers = await User.find({}, 'username role');
            allUsers.forEach(u => console.log(`  - ${u.username} (${u.role})`));
            return;
        }
        
        // Check current role
        console.log(`Current role for ${username}: ${user.role}`);
        
        if (user.role === 'admin') {
            console.log(`✅ User '${username}' is already an admin!`);
        } else {
            // Update role to admin
            user.role = 'admin';
            await user.save();
            console.log(`✅ Successfully set '${username}' as admin!`);
        }
        
        // Display final status
        const updatedUser = await User.findOne({ username: username });
        console.log(`\n📋 Final status:`);
        console.log(`  Username: ${updatedUser.username}`);
        console.log(`  Role: ${updatedUser.role}`);
        console.log(`  Active: ${updatedUser.isActive}`);
        console.log(`  Created: ${updatedUser.createdAt}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('📪 Database connection closed');
    }
}

// Get username from command line argument or use default
const username = process.argv[2] || 'nakhal69';
console.log(`🔧 Setting user '${username}' as admin...`);
setUserAsAdmin(username);
