# Google AdSense Implementation Guide

## 📋 What Was Added

### Ad Placements
1. **Home Page Top** - Above the exercise list
2. **Between Posts** - After every 3rd exercise (better user experience)
3. **After Post Content** - Below exercise/solution content

### Files Modified
- `views/index.ejs` - Added 2 ad placeholders (top & between posts)
- `views/post.ejs` - Added 1 ad placeholder (after content)
- `.env.example` - Added ADSENSE_PUBLISHER_ID field

## 🚀 Next Steps

### 1. Apply for Google AdSense
1. Go to https://www.google.com/adsense
2. Sign up with your Google account
3. Add your website: mathematiques-bac.org
4. Wait for approval (typically 1-2 weeks)

### 2. Get Your AdSense Code
Once approved:
1. Login to AdSense dashboard
2. Go to **Ads → Overview**
3. Click **"By ad unit"**
4. Create new ad units:
   - **Display ad** (for home page top & between posts)
   - **In-article ad** (for after content)
5. Copy the ad code for each unit

### 3. Replace Placeholders with Real Ad Code
Replace the placeholder `<div>` with your AdSense code:

**Current Placeholder:**
```html
<div style="min-height: 90px; display: flex; align-items: center; justify-content: center; background: #f8f9fa;">
    <span class="text-muted">AdSense Ad Unit (Home Top)</span>
</div>
```

**Replace with AdSense Code:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

### 4. Optional: Use Auto Ads
Alternatively, you can use **Auto Ads** (easier but less control):
1. Get your Auto Ads code from AdSense
2. Add it to `views/layouts/header.ejs` in the `<head>` section:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

## 💡 Tips for Maximum Revenue

1. **Don't overdo it** - Current placement (3 ads max per page) is optimal
2. **Mobile-friendly** - All placeholders use responsive design
3. **Strategic placement** - Ads are placed where users naturally pause
4. **Monitor performance** - Check AdSense reports weekly to optimize
5. **Quality content** - Keep creating valuable math exercises (higher CPC)

## 📊 Expected Earnings

For educational/math content:
- **CPM**: $3-10 per 1000 views
- **CTR**: 1-3% typical for educational sites
- **Example**: 10,000 monthly visitors = $30-100/month

## ⚠️ Important Reminders

1. **Don't click your own ads** - Google will ban you
2. **Don't ask users to click** - Violates AdSense policies
3. **Don't place ads on error pages** - Keep user experience good
4. **Wait for approval** - Don't add real ad code until approved

## 🔒 Security Note

Your secrets are safe:
- ✅ `.env` is in `.gitignore`
- ✅ No hardcoded credentials in code
- ✅ `.env.example` provided for team members

## 📝 Before Pushing

Run these checks:
```bash
# Verify .env is ignored
git status

# Should NOT see .env in the list
# If you see it, run: git rm --cached .env
```

Good luck with your AdSense application! 🎉
