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

async function generateSecureEnv() {
    console.log('=== INTERACTIVE SECURE ENVIRONMENT GENERATOR ===\n');
    console.log('🔐 This will help you generate ALL new secure secrets\n');

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
    console.log('\n📝 FIRST, go to MongoDB Atlas and change your password:');
    console.log('   1. Visit: https://cloud.mongodb.com/');
    console.log('   2. Click "Database Access" → Find user "nakhal69_db_user"');
    console.log('   3. Click Edit → Edit Password');
    console.log('   4. Use this suggested password or generate your own:\n');
    console.log(`      ${mongoPasswordSuggestion}\n`);
    console.log('   5. Click "Update User"\n');

    const mongoPassword = await question('Enter your NEW MongoDB password (paste it here): ');

    if (!mongoPassword || mongoPassword.trim().length < 8) {
        console.log('\n❌ MongoDB password is required and must be at least 8 characters!');
        rl.close();
        process.exit(1);
    }

    // Ask for reCAPTCHA keys
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: reCAPTCHA Keys');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Get NEW reCAPTCHA v3 keys:');
    console.log('   1. Visit: https://www.google.com/recaptcha/admin/create');
    console.log('   2. Label: mathematiques-bac-new');
    console.log('   3. Type: Score based (v3)');
    console.log('   4. Domains: mathematiques-bac.org, www.mathematiques-bac.org, localhost');
    console.log('   5. Submit and copy both keys\n');

    const useRecaptcha = await question('Do you want to add reCAPTCHA keys now? (yes/no): ');

    let recaptchaSiteKey = '';
    let recaptchaSecretKey = '';

    if (useRecaptcha.toLowerCase() === 'yes') {
        recaptchaSiteKey = await question('\nEnter your NEW reCAPTCHA SITE KEY: ');
        recaptchaSecretKey = await question('Enter your NEW reCAPTCHA SECRET KEY: ');

        if (!recaptchaSiteKey || !recaptchaSecretKey) {
            console.log('\n⚠️  Warning: reCAPTCHA keys not provided. You can add them later.');
            recaptchaSiteKey = 'YOUR_NEW_SITE_KEY';
            recaptchaSecretKey = 'YOUR_NEW_SECRET_KEY';
        } else {
            console.log('✅ reCAPTCHA keys saved');
        }
    } else {
        console.log('\n⚠️  Skipping reCAPTCHA. You can add keys later in .env file');
        recaptchaSiteKey = 'YOUR_NEW_SITE_KEY';
        recaptchaSecretKey = 'YOUR_NEW_SECRET_KEY';
    }

    // Ask about SMTP password
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3: Email SMTP Password (Optional)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const updateSmtp = await question('\nDo you want to update SMTP password? (yes/no): ');
    let smtpPass = 'CHANGE_THIS_TO_NEW_APP_PASSWORD';

    if (updateSmtp.toLowerCase() === 'yes') {
        smtpPass = await question('Enter your NEW SMTP password: ');
        if (!smtpPass) {
            smtpPass = 'CHANGE_THIS_TO_NEW_APP_PASSWORD';
        }
    }

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
SMTP_PASS=${smtpPass}
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
# reCAPTCHA v3 KEYS (NEW)
# ===================================
RECAPTCHA_SITE_KEY=${recaptchaSiteKey}
RECAPTCHA_SECRET_KEY=${recaptchaSecretKey}

# ===================================
# APPLICATION SETTINGS
# ===================================
NODE_ENV=production
PORT=3000
`;

    // Save to .env.new
    const newEnvPath = path.join(__dirname, '../.env.new');
    fs.writeFileSync(newEnvPath, envContent);

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ SUCCESS! New environment file created');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📝 SUMMARY OF YOUR NEW SECRETS:');
    console.log('================================\n');
    console.log('✓ MongoDB Password: ********** (saved in connection string)');
    console.log(`✓ Session Secret: ${sessionSecret}`);
    console.log(`✓ Admin Username: nakhal69`);
    console.log(`✓ Admin Password: ${adminPassword}`);
    console.log(`✓ reCAPTCHA Site Key: ${recaptchaSiteKey}`);
    console.log(`✓ reCAPTCHA Secret Key: ${recaptchaSecretKey.substring(0, 20)}...`);

    console.log('\n\n📋 NEXT STEPS:');
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
    console.log('   node -e "require(\'dotenv\').config(); const m=require(\'mongoose\'); m.connect(process.env.MONGODB_URI).then(()=>{console.log(\'✅ Connected\');process.exit(0)}).catch(e=>{console.error(\'❌\',e.message);process.exit(1)})"\n');
    console.log('6. Start your application:');
    console.log('   npm start\n');

    console.log('⚠️  IMPORTANT SECURITY REMINDERS:');
    console.log('=================================');
    console.log('• Save your admin password securely: ' + adminPassword);
    console.log('• Never commit .env file to git');
    console.log('• Your .env file is already in .gitignore');
    console.log('• Keep these secrets private and secure\n');

    console.log('✅ File saved to: .env.new\n');

    rl.close();
}

// Run the interactive generator
generateSecureEnv().catch(error => {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
});
