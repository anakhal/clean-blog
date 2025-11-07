const BlogPost=require('../models/BlogPost');
const User = require('../models/User');
const Category = require('../models/Category');

exports.index= async (req, res) => {
  try {
    const category = req.query.category;
    const query = { isDeleted: { $ne: true } };
    
    if (category) {
      query.category = category;
    }
    
    const categories = await Category.find().sort({ name: 1 });
    
    const posts = await BlogPost.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.render('index', { posts, categories, category: category || null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.create= async (req,res)=>{
    try {
        const categories = await Category.find().sort({ name: 1 });
        const exerciseId = req.query.exerciseId; // Get exerciseId if creating a solution
        res.render('create', { categories, exerciseId: exerciseId || undefined });
    } catch (err) {
        console.error(err);
        res.render('create', { categories: [], exerciseId: undefined });
    }
};

// Posting the populated form
exports.store=async (req,res)=>{  
  try {
    if (!req.session.userId) {
      console.error('No userId in session. Cannot create post.');
      return res.status(401).send('Unauthorized: Please log in as admin.');
    }
    
    console.log('DEBUG - req.session.userId:', req.session.userId);
    
    const exerciseId = req.body.exerciseId;
    const type = req.body.type || 'exercise';
    
    const blogpost = new BlogPost({
      title: req.body.title,
      body: req.body.body,
      author: req.session.userId,
      // image field removed
      category: req.body.category || 'Arithmétique',
      type: type,
      exerciseId: exerciseId || null
    });
    
    await blogpost.save();
    console.log('DEBUG - Created blogpost:', blogpost.title, 'Type:', blogpost.type);
    
    // If this is a solution, update the exercise with the solutionId
    if (exerciseId && type === 'solution') {
      await BlogPost.findByIdAndUpdate(exerciseId, { solutionId: blogpost._id });
      console.log('DEBUG - Linked solution to exercise:', exerciseId);
    }
    
    console.log('Blog post saved successfully:', blogpost.title);
    res.redirect('/');
  } catch (error) {
    console.error('Error Posting a blogpost', error);
    res.status(500).send('Error Posting a blogpost');
  }
};

exports.show=async(req,res)=>{
  try{
    const post=await BlogPost.findOne({ 
      _id: req.params.id, 
      isDeleted: { $ne: true } 
    })
    .populate('author', 'username')
    .populate('solutionId', 'title')
    .populate('exerciseId', 'title');
    
    if(!post){
      return res.status(404).send('Post not Found');
    }
    
    res.render('post',{post});
  }catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.search=async (req, res) => {
  try {
    const searchQuery = req.query.q;
    let posts = [];
    
    if (searchQuery) {
      // Search in both title and body fields, but only non-deleted posts
      posts = await BlogPost.find({
        $and: [
          { isDeleted: { $ne: true } },
          {
            $or: [
              { title: { $regex: searchQuery, $options: 'i' } },
              { body: { $regex: searchQuery, $options: 'i' } }
            ]
          }
        ]
      }).populate('author', 'username').sort({ createdAt: -1 }); // Sort by newest first
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

exports.register=(req,res)=>{res.render('register')};