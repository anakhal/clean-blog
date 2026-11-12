const mongoose = require('mongoose');

function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
        .replace(/^-+|-+$/g, '')        // Supprime les tirets en début et fin
        .substring(0, 80);
}

const blogPostSchema = new mongoose.Schema({
    title: String,
    slug: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    body: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    type: { type: String, enum: ['exercise', 'solution'], default: 'exercise' },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', default: null }, // For solutions: link to parent exercise
    solutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', default: null }, // For exercises: link to solution
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false // Optional temporarily during migration
    }
}, { timestamps: true });

// Pre-save hook to automatically generate slug if absent
blogPostSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        const baseSlug = slugify(this.title) || 'exercice';
        const suffix = this._id ? this._id.toString().slice(-6) : Math.random().toString(36).substring(2, 8);
        this.slug = `${baseSlug}-${suffix}`;
    }
    next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;
module.exports.slugify = slugify;