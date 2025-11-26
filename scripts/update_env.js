const fs = require('fs');
const path = require('path');

const content = `MONGODB_URI=mongodb+srv://nakhal69_db_user:ZyP4hpTp8Gu2LsDX@cluster0.7qv0ojt.mongodb.net/clean-blog-database?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=Guennan???Taalab%%%Kahla

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=4uts8ke7h@mozmail.com
SMTP_PASS=cbaqcsffdseuuccz
CONTACT_EMAIL=nakhal69@gmail.com
#Sendgrid API_KEy
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
CONTACT_EMAIL=4uts8ke7h@mozmail.com
# Admin
ADMIN_USERNAME=nakhal69
ADMIN_PASSWORD=Yahya__Is__In__The__Hill

# reCAPTCHA Configuration (NOUVELLES CLÉS - collez ici)
RECAPTCHA_SITE_KEY=6LclMwgsAAAAAOeemjbNz4iKXWsy73K-EkxOnohq
RECAPTCHA_SECRET_KEY=6LcoiQssAAAAAPV54eX3dM-eLSB9TJ7DIg1vcIqW
`;

fs.writeFileSync(path.join(__dirname, '../.env'), content);
console.log('.env updated successfully');
