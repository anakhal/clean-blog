const mongoose = require('mongoose');
const blogPostSchema = new mongoose.Schema({
    title: String,
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

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.exports = BlogPost;