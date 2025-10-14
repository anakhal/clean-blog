const mongoose=require('mongoose');
const blogPostSchema=new mongoose.Schema({
    title:String,
    body:String,
    image:String,
}, { timestamps: true });
// Create and export the BlogPost model using the schema object
const BlogPost=mongoose.model('BlogPost', blogPostSchema);
module.exports=BlogPost;