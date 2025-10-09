const mongoose=require('mongoose');
const blogPostSchema=new mongoose.Schema({
    title:String,
    body:String
}, { timestamps: true });
// Create and export the BlogPost model using the schema object
const BlogPost=mongoose.model('BlogPost', blogPostSchema);
module.exports=BlogPost;