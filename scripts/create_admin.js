require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path to your User model

async function createAdminUser() {
    // Get values from environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'nakhal69';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Validation
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not defined in environment variables');
        process.exit(1);
    }

    if (!ADMIN_PASSWORD) {
        console.error('❌ ADMIN_PASSWORD is not defined in environment variables');
        process.exit(1);
    }

    if (ADMIN_PASSWORD.length < 6) {
        console.error('❌ Password must be at least 6 characters long');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ username: ADMIN_USERNAME });
        if (existingUser) {
            console.log(`ℹ️  User '${ADMIN_USERNAME}' already exists. Updating to admin role...`);
            
            // Update existing user to admin
            existingUser.role = 'admin';
            existingUser.isActive = true;
            await existingUser.save();
            
            console.log(`✅ Successfully updated user '${ADMIN_USERNAME}' to admin role`);
        } else {
            // Create new admin user
            const newUser = new User({
                username: ADMIN_USERNAME,
                password: ADMIN_PASSWORD,
                role: 'admin',
                isActive: true
            });

            await newUser.save();
            console.log(`✅ Successfully created admin user '${ADMIN_USERNAME}'`);
        }

        // Verify the user was created/updated
        const verifiedUser = await User.findOne({ username: ADMIN_USERNAME });
        console.log('\n📋 User Details:');
        console.log(`   Username: ${verifiedUser.username}`);
        console.log(`   Role: ${verifiedUser.role}`);
        console.log(`   Active: ${verifiedUser.isActive}`);
        console.log(`   Created: ${verifiedUser.createdAt}`);

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('\n📦 Database connection closed');
    }
}

// Run the function
createAdminUser();