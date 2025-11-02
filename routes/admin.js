const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
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
router.post('/posts/:id/delete-permanently', adminController.deletePermanently);

// Category management
router.get('/categories', categoryController.index);
router.post('/categories', categoryController.store);
router.post('/categories/:id/delete', categoryController.delete);

// Contact messages
router.get('/contact-messages', adminController.viewContactMessages);

// User management
router.get('/users', adminController.manageUsers);

module.exports = router;