const BlogPost = require('../models/BlogPost');

// Generate sitemap.xml
exports.generateSitemap = async (req, res) => {
    try {
        const posts = await BlogPost.find({ isDeleted: false }).select('_id updatedAt').lean();

        const baseUrl = 'https://www.mathematiques-bac.org';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

        // Homepage - ONLY www version
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';

        // About page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/about</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';

        // Privacy page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/privacy</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.5</priority>\n';
        xml += '  </url>\n';

        // Contact page
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/contact</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';

        // All posts
        posts.forEach(post => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/post/${post._id}</loc>\n`;
            xml += `    <lastmod>${post.updatedAt.toISOString()}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.9</priority>\n';
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml; charset=utf-8');
        res.header('X-Robots-Tag', 'noindex');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
};

// Generate robots.txt
exports.generateRobots = (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and user areas
Disallow: /admin/
Disallow: /users/
Disallow: /login
Disallow: /register

# Disallow utility pages (not content)
Disallow: /search

# Allow important pages
Allow: /about
Allow: /privacy
Allow: /contact
Allow: /post/*

# Sitemap
Sitemap: https://www.mathematiques-bac.org/sitemap.xml`;

    res.type('text/plain');
    res.header('X-Robots-Tag', 'noindex');
    res.send(robotsTxt);
};
