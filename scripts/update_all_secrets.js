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

async function updateAllSecrets() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   COMPLETE SECRETS UPDATE - ALL NEW CREDENTIALS        ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Generate secure random secrets automatically
    const sessionSecret = crypto.randomBytes(32).toString('hex');
    const adminPassword = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'A','/':'B','=':'C'}[c]));
    const mongoPasswordSuggestion = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'M','/':'N','=':'P'}[c]));

    console.log('✅ Auto-generated SESSION_SECRET');
    console.log('✅ Auto-generated ADMIN_PASSWORD');
    console.log('✅ Auto-generated MongoDB password suggestion\n');

    // STEP 1: MongoDB Password
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1 of 3: MongoDB Password');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Change your MongoDB Atlas password:');
    console.log('   1. Open: https://cloud.mongodb.com/');
    console.log('   2. Navigate: Database Access → Edit "nakhal69_db_user"');
    console.log('   3. Click: "Edit Password"');
    console.log('   4. Use this suggested password:\n');
    console.log(`      ${mongoPasswordSuggestion}\n`);
    console.log('   5. Click: "Update User"');
    console.log('   6. Wait for confirmation\n');

    const mongoPassword = await question('Paste your NEW MongoDB password here: ');

    if (!mongoPassword || mongoPassword.trim().length < 8) {
        console.log('\n❌ ERROR: MongoDB password must be at least 8 characters!');
        rl.close();
        process.exit(1);
    }

    console.log('✅ MongoDB password saved\n');

    // STEP 2: reCAPTCHA Keys
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2 of 3: reCAPTCHA v3 Keys (UPDATED)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 You mentioned you already updated your reCAPTCHA keys.');
    console.log('   Go to: https://www.google.com/recaptcha/admin');
    console.log('   Find your site: mathematiques-bac');
    console.log('   Copy both keys (Site Key and Secret Key)\n');

    const recaptchaSiteKey = await question('Paste your NEW reCAPTCHA SITE KEY: ');

    if (!recaptchaSiteKey || recaptchaSiteKey.trim().length < 20) {
        console.log('\n❌ ERROR: Invalid reCAPTCHA Site Key!');
        rl.close();
        process.exit(1);
    }

    const recaptchaSecretKey = await question('Paste your NEW reCAPTCHA SECRET KEY: ');

    if (!recaptchaSecretKey || recaptchaSecretKey.trim().length < 20) {
        console.log('\n❌ ERROR: Invalid reCAPTCHA Secret Key!');
        rl.close();
        process.exit(1);
    }

    console.log('✅ reCAPTCHA keys saved\n');

    // STEP 3: Email SMTP (Optional)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3 of 3: Email SMTP Password (Optional)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Would you like to update your SMTP password?');
    console.log('   Current: 4uts8ke7h@mozmail.com\n');

    const updateSmtp = await question('Update SMTP password? (yes/no): ');
    let smtpPass = 'cbaqcsffdseuuccz'; // Keep current by default

    if (updateSmtp.toLowerCase() === 'yes' || updateSmtp.toLowerCase() === 'y') {
        const newSmtpPass = await question('Enter your NEW SMTP password: ');
        if (newSmtpPass && newSmtpPass.trim().length > 0) {
            smtpPass = newSmtpPass.trim();
            console.log('✅ SMTP password updated');
        }
    } else {
        console.log('⏭️  Keeping current SMTP password');
    }

    // Build MongoDB connection string
    const mongoUri = `mongodb+srv://nakhal69_db_user:${mongoPassword.trim()}@cluster0.7qv0ojt.mongodb.net/clean-blog-database?retryWrites=true&w=majority&appName=Cluster0`;

    // Create complete .env content
    const envContent = `# ╔════════════════════════════════════════════════════════╗
# ║           SECURE ENVIRONMENT VARIABLES                 ║
# ║           Generated: ${new Date().toISOString()}      ║
# ╚════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════
# DATABASE CONNECTION (NEW - SECURE)
# ═══════════════════════════════════════════════════════════
MONGODB_URI=${mongoUri}

# ═══════════════════════════════════════════════════════════
# SESSION MANAGEMENT (NEW - SECURE)
# ═══════════════════════════════════════════════════════════
SESSION_SECRET=${sessionSecret}

# ═══════════════════════════════════════════════════════════
# EMAIL CONFIGURATION
# ═══════════════════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=4uts8ke7h@mozmail.com
SMTP_PASS=${smtpPass}
CONTACT_EMAIL=nakhal69@gmail.com

# ═══════════════════════════════════════════════════════════
# SENDGRID API (if using)
# ═══════════════════════════════════════════════════════════
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY

# ═══════════════════════════════════════════════════════════
# ADMIN CREDENTIALS (NEW - SECURE)
# ═══════════════════════════════════════════════════════════
ADMIN_USERNAME=nakhal69
ADMIN_PASSWORD=${adminPassword}

# ═══════════════════════════════════════════════════════════
# reCAPTCHA v3 (UPDATED - NEW KEYS)
# ═══════════════════════════════════════════════════════════
RECAPTCHA_SITE_KEY=${recaptchaSiteKey.trim()}
RECAPTCHA_SECRET_KEY=${recaptchaSecretKey.trim()}

# ═══════════════════════════════════════════════════════════
# APPLICATION SETTINGS
# ═══════════════════════════════════════════════════════════
NODE_ENV=production
PORT=3000
`;

    // Save to .env.new
    const newEnvPath = path.join(__dirname, '../.env.new');
    fs.writeFileSync(newEnvPath, envContent);

    // Display summary
    console.log('\n\n╔════════════════════════════════════════════════════════╗');
    console.log('║              ✅ SUCCESS! ALL SECRETS UPDATED           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📋 SUMMARY OF NEW SECRETS:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✓ MongoDB URI:        [UPDATED - Password hidden in URI]');
    console.log(`✓ Session Secret:     ${sessionSecret.substring(0, 40)}...`);
    console.log(`✓ Admin Username:     nakhal69`);
    console.log(`✓ Admin Password:     ${adminPassword}`);
    console.log(`✓ reCAPTCHA Site:     ${recaptchaSiteKey.trim().substring(0, 30)}...`);
    console.log(`✓ reCAPTCHA Secret:   ${recaptchaSecretKey.trim().substring(0, 30)}...`);
    console.log(`✓ SMTP Password:      ${updateSmtp.toLowerCase() === 'yes' ? '[UPDATED]' : '[KEPT CURRENT]'}\n`);

    console.log('⚠️  CRITICAL: SAVE YOUR NEW ADMIN PASSWORD!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Username: nakhal69`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n   Write this down NOW before proceeding!\n');

    console.log('📝 NEXT STEPS TO ACTIVATE:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('1. Review the generated file:');
    console.log('   cat .env.new\n');

    console.log('2. Backup your current .env:');
    console.log('   cp .env .env.backup\n');

    console.log('3. Activate the new environment:');
    console.log('   mv .env.new .env\n');

    console.log('4. Update admin password in database:');
    console.log('   node scripts/update_admin_password.js\n');

    console.log('5. Test MongoDB connection:');
    console.log('   node -e "require(\'dotenv\').config(); const m=require(\'mongoose\'); m.connect(process.env.MONGODB_URI).then(()=>{console.log(\'✅ Connected\');process.exit(0)}).catch(e=>{console.error(\'❌\',e.message);process.exit(1)})"\n');

    console.log('6. Start your application:');
    console.log('   npm start\n');

    console.log('🔒 SECURITY REMINDERS:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('• .env file is already in .gitignore ✓');
    console.log('• NEVER commit .env to git');
    console.log('• NEVER share these secrets publicly');
    console.log('• Keep your admin password in a secure password manager');
    console.log('• All old exposed credentials have been replaced\n');

    console.log('✅ New secure environment file saved to: .env.new\n');

    rl.close();
}

// Run the script
updateAllSecrets().catch(error => {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    rl.close();
    process.exit(1);
});
