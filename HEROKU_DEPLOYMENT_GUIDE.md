# 🚀 Heroku Deployment Guide for Clean Blog

## Prerequisites
- [x] Heroku CLI installed
- [x] Git repository initialized
- [x] MongoDB Atlas cluster configured
- [x] Gmail account with app password for SMTP

## Step 1: Prepare Your App

### Files Created/Updated:
- ✅ `Procfile` - Tells Heroku how to run your app
- ✅ `package.json` - Node.js version and scripts specified
- ✅ `.env.production.example` - Production environment template
- ✅ Enhanced `index.js` with production optimizations

## Step 2: Install Heroku CLI and Login

```bash
# Install Heroku CLI (if not already installed)
# Visit: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login
```

## Step 3: Create Heroku Application

```bash
# Create a new Heroku app (replace 'your-app-name' with desired name)
heroku create your-clean-blog-app

# Or if you want to specify a region
heroku create your-clean-blog-app --region eu
```

## Step 4: Configure Environment Variables

Set these environment variables in Heroku:

```bash
# Required Production Variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET="your-super-strong-session-secret-minimum-32-characters"

# Database Configuration (use your Atlas connection string)
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clean-blog-database?retryWrites=true&w=majority"

# Email Configuration
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-blog-email@gmail.com
heroku config:set SMTP_PASS=your-gmail-app-password
heroku config:set CONTACT_EMAIL=your-contact-email@gmail.com

# Security Configuration
heroku config:set CORS_ORIGIN=https://your-clean-blog-app.herokuapp.com
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
```

## Step 5: Deploy to Heroku

```bash
# Add Heroku remote (if not already added)
heroku git:remote -a your-clean-blog-app

# Commit your changes
git add .
git commit -m "Prepare for Heroku deployment"

# Deploy to Heroku
git push heroku main

# Or if your main branch is named 'master'
git push heroku master
```

## Step 6: Post-Deployment Setup

```bash
# Check if your app is running
heroku ps:scale web=1

# View logs
heroku logs --tail

# Open your app in browser
heroku open

# Check health endpoint
curl https://your-clean-blog-app.herokuapp.com/health
```

## Step 7: Create Admin User

After deployment, you'll need to create an admin user:

1. Register a user account on your deployed app
2. Use Heroku console to set user as admin:

```bash
# Open Heroku console
heroku run node

# In the Node console:
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const user = await User.findOne({ username: 'your-username' });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log('User set as admin!');
  }
  process.exit(0);
});
```

## Step 8: Verify Deployment

Check these URLs on your deployed app:
- ✅ Home page: `https://your-app.herokuapp.com/`
- ✅ Health check: `https://your-app.herokuapp.com/health`
- ✅ Contact form: `https://your-app.herokuapp.com/contact`
- ✅ Admin dashboard: `https://your-app.herokuapp.com/admin`

## Ongoing Maintenance

### Viewing Logs
```bash
heroku logs --tail --app your-clean-blog-app
```

### Restarting Your App
```bash
heroku restart --app your-clean-blog-app
```

### Updating Environment Variables
```bash
heroku config:set VARIABLE_NAME=new_value --app your-clean-blog-app
```

### Scaling Your App
```bash
# Scale up (requires paid dyno)
heroku ps:scale web=2

# Scale down
heroku ps:scale web=1
```

## Troubleshooting

### Common Issues:

1. **App not starting**: Check `heroku logs --tail`
2. **Database connection**: Verify MongoDB URI in config vars
3. **Email not working**: Check SMTP credentials
4. **Static files not loading**: Check if compression is working
5. **HTTPS redirect issues**: Verify Heroku domain in CORS_ORIGIN

### Useful Commands:
```bash
heroku config              # View all config vars
heroku ps                  # Check dyno status  
heroku releases            # View deployment history
heroku rollback v123       # Rollback to specific version
```

## Performance Monitoring

Your app includes:
- ✅ Request logging with Morgan
- ✅ Error logging with Winston  
- ✅ Health check endpoint at `/health`
- ✅ Gzip compression
- ✅ Static file caching
- ✅ Rate limiting

Monitor your app's performance through:
- Heroku metrics dashboard
- Health check endpoint responses
- Log analysis

## Security Features Enabled

- ✅ Helmet.js security headers
- ✅ HTTPS enforcement in production
- ✅ CORS configured for production domain
- ✅ Rate limiting with configurable limits
- ✅ Session security with strong secrets
- ✅ Input validation and sanitization

Your Clean Blog is now production-ready! 🎉