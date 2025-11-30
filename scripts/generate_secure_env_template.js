const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('=== SECURE ENVIRONMENT SECRETS GENERATOR ===\n');
console.log('🔐 Generating new secure secrets...\n');

// Generate secure random secrets
const sessionSecret = crypto.randomBytes(32).toString('hex');
const adminPassword = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'A','/':'B','=':'C'}[c]));
const mongoPasswordSuggestion = crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, c => ({'+':'M','/':'N','=':'P'}[c]));

console.log('✅ Generated new SESSION_SECRET');
console.log('✅ Generated new ADMIN_PASSWORD');
console.log('✅ Generated MongoDB password suggestion\n');

// Your NEW reCAPTCHA keys from the screenshot
const newRecaptchaSiteKey = '6LcsAxksAAAAHnOq_MNt8a3jsEJ286HMmHEF-Ou';
const newRecaptchaSecretKey = '6LcsAxksAAAALsdgrHk8gP0OGrfPLjN6AGxnnZj';

const envTemplate = `# ===================================
# MONGODB CONNECTION
# ===================================
# IMPORTANT: Change this password in MongoDB Atlas first!
# 1. Go to: https://cloud.mongodb.com/
# 2. Click "Database Access" → Edit user "nakhal69_db_user"
# 3. Generate new password or use the suggestion below
# 4. Update the connection string here
MONGODB_URI=mongodb+srv://nakhal69_db_user:CHANGE_THIS_PASSWORD@cluster0.7qv0ojt.mongodb.net/clean-blog-database?retryWrites=true&w=majority&appName=Cluster0

# Suggested new MongoDB password (copy this to MongoDB Atlas):
# ${mongoPasswordSuggestion}

# ===================================
# SESSION SECRET (NEW - SECURE)
# ===================================
SESSION_SECRET=${sessionSecret}

# ===================================
# EMAIL CONFIGURATION
# ===================================
# Keep your SMTP settings but consider regenerating the app password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=4uts8ke7h@mozmail.com
SMTP_PASS=CHANGE_THIS_TO_NEW_APP_PASSWORD
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
# reCAPTCHA v3 KEYS (NEW KEYS)
# ===================================
RECAPTCHA_SITE_KEY=${newRecaptchaSiteKey}
RECAPTCHA_SECRET_KEY=${newRecaptchaSecretKey}
`;

// Save to a template file (NOT .env to avoid overwriting)
const templatePath = path.join(__dirname, '../.env.new');
fs.writeFileSync(templatePath, envTemplate);

console.log('📝 INSTRUCTIONS:');
console.log('================\n');
console.log('1. NEW SECRETS GENERATED:');
console.log('   ✓ Session Secret: ' + sessionSecret);
console.log('   ✓ Admin Password: ' + adminPassword);
console.log('   ✓ MongoDB Password Suggestion: ' + mongoPasswordSuggestion);
console.log('   ✓ reCAPTCHA Keys: Updated from your screenshot\n');

console.log('2. MONGODB ATLAS - CHANGE PASSWORD:');
console.log('   a) Go to: https://cloud.mongodb.com/');
console.log('   b) Click "Database Access" in left sidebar');
console.log('   c) Find user "nakhal69_db_user" and click Edit');
console.log('   d) Click "Edit Password"');
console.log('   e) Use this password: ' + mongoPasswordSuggestion);
console.log('   f) Click "Update User"\n');

console.log('3. UPDATE YOUR .env FILE:');
console.log('   a) A new template has been created: .env.new');
console.log('   b) Review the file: cat .env.new');
console.log('   c) Replace CHANGE_THIS_PASSWORD with your actual MongoDB password');
console.log('   d) Backup your old .env: mv .env .env.old');
console.log('   e) Use the new one: mv .env.new .env\n');

console.log('4. UPDATE ADMIN PASSWORD IN DATABASE:');
console.log('   Run: node scripts/update_admin_password.js\n');

console.log('5. TEST YOUR APPLICATION:');
console.log('   Run: npm start\n');

console.log('⚠️  IMPORTANT REMINDERS:');
console.log('   • Never commit .env file to git');
console.log('   • Never share these secrets publicly');
console.log('   • Save your new admin password securely');
console.log('   • Your new admin password is: ' + adminPassword);
console.log('\n✅ Template saved to: .env.new\n');
