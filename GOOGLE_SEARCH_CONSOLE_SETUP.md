# Google Search Console Setup Guide

## Quick Start - Getting Your Site Indexed by Google

Follow these steps to get your website `mathematiques-bac.org` properly indexed by Google and improve your search rankings.

---

## Step 1: Verify Your Website with Google Search Console

### 1.1 Access Google Search Console
1. Go to: https://search.google.com/search-console
2. Sign in with your Google account
3. Click **"Add Property"** or **"Start Now"**

### 1.2 Choose Property Type
- Select **"URL prefix"**
- Enter: `https://www.mathematiques-bac.org`
- Click **Continue**

### 1.3 Verify Ownership

You have several verification methods. Choose the easiest one for your setup:

#### Option A: HTML File Upload (Recommended for Railway)
1. Google will provide an HTML file (e.g., `google1234567890abcdef.html`)
2. Download this file
3. Upload it to your Railway deployment:
   ```bash
   # Create the file in your public folder
   echo "google-site-verification: google1234567890abcdef.html" > public/google1234567890abcdef.html
   
   # Commit and push
   git add public/google1234567890abcdef.html
   git commit -m "Add Google Search Console verification file"
   git push origin main
   ```
4. Wait for Railway to deploy
5. Verify the file is accessible: `https://www.mathematiques-
   </head>
   ```
3. Commit, push, and deploy
4. Click **Verify** in Google Search Console

#### Option C: DNS Verification (If you manage DNS)
1. Add a TXT record to your domain's DNS settings
2. Use the value provided by Google
3. Wait for DNS propagation (can take up to 24 hours)
4. Click **Verify**

---

## Step 2: Submit Your Sitemap

Once verified, submit your sitemap to help Google index all your pages.

### 2.1 Submit Sitemap
1. In Google Search Console, go to **"Sitemaps"** in the left menu
2. Enter your sitemap URL: `sitemap.xml`
3. Click **Submit**

Your full sitemap URL will be: `https://www.mathematiques-bac.org/sitemap.xml`

### 2.2 Verify Sitemap is Working
Test your sitemap manually:
- Visit: https://www.mathematiques-bac.org/sitemap.xml
- You should see XML with all your pages listed
- If you see an error, check the server logs

---

## Step 3: Request Indexing for Key Pages

Don't wait for Google to discover your pages - request indexing immediately!

### 3.1 Request Indexing for Homepage
1. In Google Search Console, go to **"URL Inspection"** (top of the page)
2. Enter: `https://www.mathematiques-bac.org/`
3. Wait for the inspection to complete
4. Click **"Request Indexing"**
5. Wait for confirmation (may take a few minutes)

### 3.2 Request Indexing for Important Pages
Repeat the process for:
- Homepage: `https://www.mathematiques-bac.org/`
- About page: `https://www.mathematiques-bac.org/about`
- Search page: `https://www.mathematiques-bac.org/search`
- Top 5-10 most important exercises

### 3.3 Bulk Indexing Request
For faster results, you can also use the **Sitemaps** feature:
- Google will automatically crawl all URLs in your sitemap
- This happens within 1-7 days typically

---

## Step 4: Check Indexing Status

### 4.1 Monitor Index Coverage
1. Go to **"Index" > "Pages"** in the left menu
2. Check the **"Why pages aren't indexed"** section
3. Look for any errors or warnings

### 4.2 What to Expect
- **Day 1-3**: Google starts discovering your pages
- **Week 1**: First pages appear in search results
- **Week 2-4**: More pages get indexed
- **Month 2-3**: Full site is indexed and rankings improve

---

## Step 5: Set Up Enhanced Features

### 5.1 Connect Google Analytics
1. In Google Search Console, go to **"Settings"**
2. Click **"Google Analytics property"**
3. Select your Analytics property (ID: G-X4Z905G4M2)
4. This connects the two for better insights

### 5.2 Enable Email Notifications
1. Go to **"Settings" > "Users and permissions"**
2. Make sure your email is added
3. Check **"Email notifications"**
4. You'll get alerts for critical issues

### 5.3 Review Search Performance
After a few days, check:
1. Go to **"Performance"** in the left menu
2. See queries, clicks, impressions, and positions
3. Filter by page, country (Morocco), or device

---

## Step 6: Optimize for Better Rankings

### 6.1 Fix Any Issues
Regularly check:
- **Coverage issues**: Fix any errors reported
- **Mobile usability**: Ensure all pages are mobile-friendly
- **Core Web Vitals**: Improve page speed if needed
- **Security issues**: Fix any HTTPS problems

### 6.2 Monitor Search Queries
1. Go to **"Performance" > "Search results"**
2. Click on **"Queries"** tab
3. See what people are searching for
4. Create content around popular queries

### 6.3 Track Your Target Keywords
Monitor these keywords in Search Console:
- "mathematiques-bac"
- "exercices maths bac maroc"
- "bac maroc maths"
- "examen national maths"
- Your category names (arithmétique, algèbre, etc.)

---

## Step 7: Ongoing Maintenance

### Weekly Tasks
- [ ] Check for new indexing issues
- [ ] Review search performance
- [ ] Request indexing for new posts

### Monthly Tasks
- [ ] Analyze top-performing pages
- [ ] Review click-through rates (CTR)
- [ ] Identify pages with impressions but low clicks (improve titles/descriptions)
- [ ] Check for crawl errors

### Quarterly Tasks
- [ ] Review mobile usability
- [ ] Analyze Core Web Vitals
- [ ] Update underperforming content
- [ ] Create new content based on search queries

---

## Troubleshooting Common Issues

### "Page is not indexed"
**Solutions:**
1. Request indexing manually via URL Inspection
2. Check if robots.txt is blocking the page
3. Ensure the page has no "noindex" tag
4. Wait 7-14 days after requesting indexing

### "Submitted URL not found (404)"
**Solutions:**
1. Verify the URL is correct and accessible
2. Check your server logs
3. Ensure Railway deployment is working
4. Test the URL in incognito mode

### "Submitted URL has crawl issue"
**Solutions:**
1. Check server response time (should be < 3 seconds)
2. Verify no server errors (500, 502, 503)
3. Check Railway logs for errors
4. Ensure sufficient server resources

### "Soft 404"
**Solutions:**
1. Make sure 404 pages return proper 404 status code
2. Add more content to thin pages
3. Ensure pages have substantial content

---

## Verification Checklist

After completing all steps, verify:

- [ ] Website is verified in Google Search Console
- [ ] Sitemap is submitted and shows no errors
- [ ] At least 5 key pages are indexed
- [ ] No critical errors in Coverage report
- [ ] Mobile usability has no issues
- [ ] Core Web Vitals are acceptable
- [ ] Search Analytics is showing data (after 2-3 days)

---

## Expected Results Timeline

| Timeframe | What to Expect |
|-----------|----------------|
| **Day 1-2** | Verification complete, sitemap submitted |
| **Day 3-7** | First pages appear in Google index |
| **Week 2** | Homepage starts appearing in search results |
| **Week 3-4** | More pages indexed, first organic traffic |
| **Month 2** | Ranking improvements for target keywords |
| **Month 3+** | Steady organic traffic growth |

**Remember:** SEO is a marathon, not a sprint. New sites typically take 3-6 months to rank well.

---

## Need Help?

### Google Resources
- **Search Console Help**: https://support.google.com/webmasters
- **SEO Starter Guide**: https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Google Search Central**: https://developers.google.com/search

### Tools to Use
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **Rich Results Test**: https://search.google.com/test/rich-results

### Community
- **Webmaster Forum**: https://support.google.com/webmasters/community
- **Reddit r/SEO**: https://reddit.com/r/SEO
- **Stack Overflow**: Tag your questions with "google-search-console"

---

## Quick Reference Commands

```bash
# Verify sitemap is accessible
curl https://www.mathematiques-bac.org/sitemap.xml

# Check robots.txt
curl https://www.mathematiques-bac.org/robots.txt

# Test a specific page
curl -I https://www.mathematiques-bac.org/

# View server logs (on Railway)
railway logs

# Deploy latest changes
git push origin main
```

---

**Good luck with your SEO journey! 🚀**

*Last updated: December 4, 2025*