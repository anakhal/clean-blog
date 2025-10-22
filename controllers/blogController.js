
const BlogPost=require('../models/BlogPost');
const User = require('../models/User');
exports.index= async (req, res) => {
  try {
    const posts = await BlogPost.find({}).populate('author', 'username').sort({ createdAt: -1 });
    res.render('index',{posts});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
 
};
exports.create=(req,res)=>{
res.render('create');
};
// Posting the populated form
exports.store=async (req,res)=>{  
  try{
    const blogpost=new BlogPost({
      title:req.body.title,
      body:req.body.body,
      author: req.session.userId, // Set the logged-in user as author
      image:'/img/' + req.files.image.name,
    })
    req.files.image.mv('./public/img/'+req.files.image.name);
    await blogpost.save();
    console.log('Blog post saved successfully:', blogpost.title);
  }catch(error){
    console.error('Error Posting a blogpost',error);
  }
  res.redirect('/')
};
exports.show=async(req,res)=>{
  try{
  const post=await BlogPost.findById(req.params.id).populate('author', 'username');
  if(!post){return res.status(404).send('Post not Found')};
   res.render('post',{post});
}catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
}
// search
exports.search=async (req, res) => {
  try {
    const searchQuery = req.query.q;
    let posts = [];
    
    if (searchQuery) {
      // Search in both title and body fields
      posts = await BlogPost.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { body: { $regex: searchQuery, $options: 'i' } }
        ]
      }).populate('author', 'username').sort({ _id: -1 }); // Sort by newest first
    }
    
    res.render('search', { 
      posts: posts, 
      searchQuery: searchQuery || '',
      resultsCount: posts.length 
    })
  } catch (err) {
    console.error(err);
    res.status(500).send('Search error');
  }
};
//register
exports.register=(req,res)=>{res.render('register')};