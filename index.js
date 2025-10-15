require('dotenv').config();
const express = require('express');
const app = express();
const fileUpload=require('express-fileupload');
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const mongoose=require('mongoose');
const BlogPost=require('./models/BlogPost');

// Use environment variable or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDbName';

mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
//validateMiddleWare
const validateMiddleWare=(req,res,next)=>{
  if(!req.body.title||!req.body.body||!req.files||!req.files.image) {
    return res.redirect('/posts/new');
    }
    //If validation passes
    next();
  }
app.use('/posts/store',validateMiddleWare);
app.use(express.static('public'));
const ejs = require('ejs');
app.set('view engine','ejs');
const port = process.env.PORT || 4000;

app.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({});
    res.render('index',{posts});
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
 
});
app.get('/about', (req, res) => {res.render('about')});
app.get('/contact', (req, res) => {res.render('contact')});
app.get('/post', (req, res) => {res.render('post')});
app.get('/posts/new',(req,res)=>{
  res.render('create');
})

app.post('/posts/store', async (req,res)=>{
  
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
})
app.get('/post/:id',async(req,res)=>{
  try{
  const post=await BlogPost.findById(req.params.id);
  if(!post){res.status(404).send('Post not Found')};
  res.render('post',{post});
}catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
})
// Search route
app.get('/search', async (req, res) => {
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Search error');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
