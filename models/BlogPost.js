const mongoose=require('mongoose');
const blogPostSchema=new mongoose.Schema({
    title:String,
    body:String,
    author: {
        type: mongoose.Schema.Types.ObjectId, // The type is a MongoDB ObjectId
        ref: 'User', // This tells Mongoose the ID refers to a document in the 'User' collection
        required: true // Making it required ensures every new post has an author
    },
    image:String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    type: { type: String, enum: ['exercise', 'solution'], default: 'exercise' },
    solution: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', default: null },
    category: {
        type: String,
        default: 'Arithmétique'
    }
 
}, { timestamps: true });
// Create and export the BlogPost model using the schema object
const BlogPost=mongoose.model('BlogPost', blogPostSchema);
module.exports=BlogPost;