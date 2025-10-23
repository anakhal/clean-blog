const express=require('express');
const router=express.Router();
const blogController=require('../controllers/blogController');
const validateMiddleware=require('../middleware/validateMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public routes - no authentication required
router.get('/', blogController.index);
router.get('/post/:id', blogController.show);
router.get('/search', blogController.search);

// Admin-only routes - require admin privileges
router.get('/posts/new', requireAdmin, blogController.create);
router.post('/posts/store', requireAdmin, validateMiddleware, blogController.store);

module.exports=router;