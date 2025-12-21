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
  res.render("games/mastermind", { showAds: false }); // Games = behavioral content, no ads allowed per AdSense policy
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
