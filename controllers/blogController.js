
const BlogPost=require('../models/BlogPost');
exports.index= async (req, res) => {
  try {
    const posts = await BlogPost.find({});
    res.render('index',{posts});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
 
};
exports.create=(req,res)=>{
res.render('create');
};

exports.store=async (req,res)=>{
  
  try{
    const blogpost=new BlogPost({
      title:req.body.title,
      body:req.body.body,
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
  const post=await BlogPost.findById(req.params.id);
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
      }).sort({ _id: -1 }); // Sort by newest first
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