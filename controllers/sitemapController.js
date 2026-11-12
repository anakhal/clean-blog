const BlogPost = require('../models/BlogPost');
const Category = require('../models/Category');

// Generate sitemap.xml
exports.generateSitemap = async (req, res) => {
    try {
        // Ne récupérer que les exercices actifs (les solutions sont fusionnées dans les exercices)
        const posts = await BlogPost.find({
            isDeleted: false,
            type: 'exercise'
        })
            .select('_id slug updatedAt createdAt')
            .lean();

        // Récupérer les catégories pour indexer les pages piliers de chapitres
        const categories = await Category.find().select('name updatedAt').lean();

        const baseUrl = 'https://www.mathematiques-bac.org';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
        xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
        xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

        // Formatage standard YYYY-MM-DD
        const formatDate = (date) => {
            if (!date) return '2026-01-01';
            try {
                return new Date(date).toISOString().split('T')[0];
            } catch (e) {
                return '2026-01-01';
            }
        };

        // Calcul de la date la plus récente parmi les exercices pour lastmod de l'accueil
        let latestPostDate = new Date('2026-01-01');
        posts.forEach(p => {
            const d = new Date(p.updatedAt || p.createdAt || 0);
            if (d > latestPostDate) latestPostDate = d;
        });

        // 1. Page d'accueil
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += `    <lastmod>${formatDate(latestPostDate)}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
        xml += '  </url>\n';

        // 2. Pages Piliers des Chapitres / Catégories
        categories.forEach(cat => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/chapitre/${encodeURIComponent(cat.name)}</loc>\n`;
            xml += `    <lastmod>${formatDate(cat.updatedAt || latestPostDate)}</lastmod>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.8</priority>\n';
            xml += '  </url>\n';
        });

        // 3. Pages statiques d'information
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/about</loc>\n`;
        xml += '    <lastmod>2026-02-01</lastmod>\n';
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';

        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/contact</loc>\n`;
        xml += '    <lastmod>2026-02-01</lastmod>\n';
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.5</priority>\n';
        xml += '  </url>\n';

        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/privacy</loc>\n`;
        xml += '    <lastmod>2026-02-01</lastmod>\n';
        xml += '    <changefreq>yearly</changefreq>\n';
        xml += '    <priority>0.3</priority>\n';
        xml += '  </url>\n';

        // 4. Tous les exercices individuels enrichis (avec slugs sémantiques)
        posts.forEach(post => {
            const identifier = post.slug || post._id;
            const lastModDate = formatDate(post.updatedAt || post.createdAt);
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/post/${identifier}</loc>\n`;
            xml += `    <lastmod>${lastModDate}</lastmod>\n`;
            xml += '    <changefreq>monthly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
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
Allow: /chapitre/*
Allow: /post/*

# Sitemap
Sitemap: https://www.mathematiques-bac.org/sitemap.xml`;

    res.type('text/plain');
    res.header('X-Robots-Tag', 'noindex');
    res.send(robotsTxt);
};
