const Category = require('../models/Category');

// Display all categories
exports.index = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.render('admin/categories', { categories });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Store a new category
exports.store = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name || !name.trim()) {
            return res.status(400).send('Category name is required');
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).send('Category already exists');
        }

        const category = new Category({
            name: name.trim()
        });

        await category.save();
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).send('Category already exists');
        }
        res.status(500).send('Server error');
    }
};

// Delete a category
exports.delete = async (req, res) => {
    try {
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.redirect('/admin/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
