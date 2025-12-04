const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const validateMiddleware = require("../middleware/validateMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");
const BlogPost = require("../models/BlogPost");
const Category = require("../models/Category");

// Public routes - no authentication required
router.get("/", blogController.index);
router.get("/post/:id", blogController.show);
router.get("/search", blogController.search);
router.get("/games/mastermind", (req, res) => {
  res.render("games/mastermind");
});

// Sitemap XML route
router.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await BlogPost.find({ isDeleted: { $ne: true } }).sort({
      updatedAt: -1,
    });
    const categories = await Category.find();

    res.header("Content-Type", "application/xml");
    res.header("X-Robots-Tag", "noindex");

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Homepage
    xml += "  <url>\n";
    xml += "    <loc>https://www.mathematiques-bac.org/</loc>\n";
    xml += "    <changefreq>daily</changefreq>\n";
    xml += "    <priority>1.0</priority>\n";
    xml += "  </url>\n";

    // About page
    xml += "  <url>\n";
    xml += "    <loc>https://www.mathematiques-bac.org/about</loc>\n";
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";

    // Search page
    xml += "  <url>\n";
    xml += "    <loc>https://www.mathematiques-bac.org/search</loc>\n";
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    xml += "  </url>\n";

    // Category pages
    categories.forEach((cat) => {
      xml += "  <url>\n";
      xml += `    <loc>https://www.mathematiques-bac.org/?category=${encodeURIComponent(cat.name)}</loc>\n`;
      xml += "    <changefreq>weekly</changefreq>\n";
      xml += "    <priority>0.8</priority>\n";
      xml += "  </url>\n";
    });

    // All posts
    posts.forEach((post) => {
      xml += "  <url>\n";
      xml += `    <loc>https://www.mathematiques-bac.org/post/${post._id}</loc>\n`;
      xml += `    <lastmod>${post.updatedAt.toISOString().split("T")[0]}</lastmod>\n`;
      xml += "    <changefreq>weekly</changefreq>\n";
      xml += "    <priority>0.6</priority>\n";
      xml += "  </url>\n";
    });

    xml += "</urlset>";
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

// Robots.txt route
router.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

# Disallow admin and user areas
Disallow: /admin/
Disallow: /users/
Disallow: /posts/new
Disallow: /posts/store

# Sitemap
Sitemap: https://www.mathematiques-bac.org/sitemap.xml`);
});

// Admin-only routes - require admin privileges
router.get("/posts/new", requireAdmin, blogController.create);
router.post(
  "/posts/store",
  requireAdmin,
  validateMiddleware,
  blogController.store,
); // Re-added validateMiddleware

module.exports = router;
