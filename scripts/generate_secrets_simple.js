require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function generateSecrets() {
    console.log('=== SIMPLE SECRETS GENERATOR ===\n');
    console.log('🔐 Generating new secure secrets (skipping reCAPTCHA)\n');

    // Generate secure random secrets automatically
    const sessionSecret = crypto.randomBytes(32).toString('hex');
    const adminPassword = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'A','/':'B','=':'C'}[c]));
    const mongoPasswordSuggestion = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'M','/':'N','=':'P'}[c]));

    console.log('✅ Generated new SESSION_SECRET');
    console.log('✅ Generated new ADMIN_PASSWORD');
    console.log('✅ Generated MongoDB password suggestion\n');

    // Ask for MongoDB password
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1: MongoDB Password');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 First, change your MongoDB password:');
    console.log('   1. Visit: https://cloud.mongodb.com/');
    console.log('   2. Click "Database Access" → Edit "nakhal69_db_user"');
    console.log('   3. Click "Edit Password"');
    console.log('   4. Use this password or generate your own:\n');
    console.log(`      ${mongoPasswordSuggestion}\n`);
    console.log('   5. Click "Update User"\n');

    const mongoPassword = await question('Enter your NEW MongoDB password: ');

    if (!mongoPassword || mongoPassword.trim().length < 8) {
        console.log('\n❌ MongoDB password is required (min 8 characters)!');
        rl.close();
        process.exit(1);
    }

    // Read current .env to preserve reCAPTCHA keys
    const currentEnvPath = path.join(__dirname, '../.env');
    let currentRecaptchaSiteKey = 'YOUR_RECAPTCHA_SITE_KEY';
    let currentRecaptchaSecretKey = 'YOUR_RECAPTCHA_SECRET_KEY';

    if (fs.existsSync(currentEnvPath)) {
        const currentEnv = fs.readFileSync(currentEnvPath, 'utf8');
        const siteKeyMatch = currentEnv.match(/RECAPTCHA_SITE_KEY=(.+)/);
        const secretKeyMatch = currentEnv.match(/RECAPTCHA_SECRET_KEY=(.+)/);

        if (siteKeyMatch) currentRecaptchaSiteKey = siteKeyMatch[1].trim();
        if (secretKeyMatch) currentRecaptchaSecretKey = secretKeyMatch[1].trim();
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: reCAPTCHA Keys');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Your current reCAPTCHA keys will be PRESERVED for now.');
    console.log('   You can manually update them in the .env file later.\n');
    console.log('   To get NEW keys, you must:');
    console.log('   1. Go to: https://www.google.com/recaptcha/admin');
    console.log('   2. Delete your old site');
    console.log('   3. Create a new site with new keys');
    console.log('   4. Update RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY in .env\n');

    // Create the new .env content
    const mongoUri = `mongodb+srv://nakhal69_db_user:${mongoPassword.trim()}@cluster0.7qv0ojt.mongodb.net/clean-blog-database?retryWrites=true&w=majority&appName=Cluster0`;

    const envContent = `# ===================================
# MONGODB CONNECTION (NEW - SECURE)
# ===================================
MONGODB_URI=${mongoUri}

# ===================================
# SESSION SECRET (NEW - SECURE)
# ===================================
SESSION_SECRET=${sessionSecret}

# ===================================
# EMAIL CONFIGURATION
# ===================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=4uts8ke7h@mozmail.com
SMTP_PASS=cbaqcsffdseuuccz
CONTACT_EMAIL=nakhal69@gmail.com

# ===================================
# SENDGRID (if using)
# ===================================
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY

# ===================================
# ADMIN CREDENTIALS (NEW - SECURE)
# ===================================
ADMIN_USERNAME=nakhal69
ADMIN_PASSWORD=${adminPassword}

# ===================================
# reCAPTCHA v3 KEYS (PRESERVED - UPDATE MANUALLY)
# ===================================
# ⚠️  These are your OLD keys - you should replace them!
# To get new keys: Delete old site and create new one at https://www.google.com/recaptcha/admin
RECAPTCHA_SITE_KEY=${currentRecaptchaSiteKey}
RECAPTCHA_SECRET_KEY=${currentRecaptchaSecretKey}

# ===================================
# APPLICATION SETTINGS
# ===================================
NODE_ENV=production
PORT=3000
`;

    // Save to .env.new
    const newEnvPath = path.join(__dirname, '../.env.new');
    fs.writeFileSync(newEnvPath, envContent);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCESS! New environment file created');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 SUMMARY OF YOUR NEW SECRETS:');
    console.log('================================\n');
    console.log('✓ MongoDB Password: [UPDATED - HIDDEN]');
    console.log(`✓ Session Secret: ${sessionSecret}`);
    console.log(`✓ Admin Username: nakhal69`);
    console.log(`✓ Admin Password: ${adminPassword}`);
    console.log('✓ reCAPTCHA Keys: [PRESERVED - NEEDS MANUAL UPDATE]');

    console.log('\n\n⚠️  SAVE YOUR NEW ADMIN PASSWORD:');
    console.log('==================================');
    console.log(`Admin Username: nakhal69`);
    console.log(`Admin Password: ${adminPassword}`);
    console.log('\nWrite this down securely before proceeding!\n');

    console.log('\n📋 NEXT STEPS:');
    console.log('=============\n');
    console.log('1. Review the generated file:');
    console.log('   cat .env.new\n');
    console.log('2. Backup your old .env:');
    console.log('   cp .env .env.backup\n');
    console.log('3. Replace with new secure .env:');
    console.log('   mv .env.new .env\n');
    console.log('4. Update admin password in database:');
    console.log('   node scripts/update_admin_password.js\n');
    console.log('5. Test MongoDB connection:');
    console.log('   npm start\n');
    console.log('6. Later, update reCAPTCHA keys manually in .env file\n');

    console.log('✅ File saved to: .env.new\n');

    rl.close();
}

// Run the generator
generateSecrets().catch(error => {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
});
