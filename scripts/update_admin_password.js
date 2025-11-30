require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Import User model
const User = require('../models/User');

async function updateAdminPassword() {
    try {
        console.log('=== UPDATE ADMIN PASSWORD ===\n');

        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get admin username from .env or use default
        const adminUsername = process.env.ADMIN_USERNAME || 'nakhal69';

        // Find the admin user
        const adminUser = await User.findOne({ username: adminUsername, role: 'admin' });

        if (!adminUser) {
            console.error(`❌ Admin user "${adminUsername}" not found!`);
            console.log('\nAvailable users:');
            const users = await User.find({}).select('username role');
            users.forEach(u => console.log(`  - ${u.username} (${u.role})`));
            process.exit(1);
        }

        console.log(`Found admin user: ${adminUser.username}`);

        // Get new password from .env
        const newPassword = process.env.ADMIN_PASSWORD;

        if (!newPassword || newPassword.length < 8) {
            console.error('❌ ADMIN_PASSWORD not set in .env or too short (min 8 chars)');
            console.log('\nPlease set ADMIN_PASSWORD in your .env file');
            process.exit(1);
        }

        // Ask for confirmation
        rl.question(`\nAre you sure you want to update the password for "${adminUsername}"? (yes/no): `, async (answer) => {
            if (answer.toLowerCase() !== 'yes') {
                console.log('❌ Password update cancelled');
                await mongoose.connection.close();
                process.exit(0);
            }

            try {
                // Hash the new password
                console.log('\nHashing new password...');
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Update the user
                adminUser.password = hashedPassword;
                await adminUser.save();

                console.log('✅ Admin password updated successfully!');
                console.log('\n📝 New credentials:');
                console.log(`   Username: ${adminUsername}`);
                console.log(`   Password: ${newPassword}`);
                console.log('\n⚠️  Save these credentials securely!');

                await mongoose.connection.close();
                console.log('\n✅ Database connection closed');
                process.exit(0);
            } catch (error) {
                console.error('❌ Error updating password:', error.message);
                await mongoose.connection.close();
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

// Run the script
updateAdminPassword();
