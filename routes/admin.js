const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminMiddleware');

// All admin routes require admin authentication
router.use(requireAdmin);

// Admin dashboard
router.get('/dashboard', adminController.dashboard);

// Post management
router.get('/posts', adminController.managePosts);
router.get('/posts/:id/edit', adminController.editPost);
router.post('/posts/:id/update', adminController.updatePost);
router.post('/posts/:id/delete', adminController.deletePost);
router.post('/posts/:id/restore', adminController.restorePost);

// User management
router.get('/users', adminController.manageUsers);

module.exports = router;