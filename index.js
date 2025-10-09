require('dotenv').config();
const express = require('express');
const app = express();
const mongoose=require('mongoose');
const BlogPost=require('./models/BlogPost');

// Use environment variable or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myDbName';

mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Create a sample post if none exist
    const count = await BlogPost.countDocuments();
    if (count === 0) {
      const sample = new BlogPost({
        title: 'Les Maths',
        body: "Les Maths est la science des sages qui aiment souffrir en pensant"
      });
      await sample.save();
      console.log('Created sample blog post');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

app.use(express.static('public'));
const ejs = require('ejs');
app.set('view engine','ejs');
const port = process.env.PORT || 4000;

app.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().lean();
    res.render('index', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.get('/about', (req, res) => {res.render('about')});
app.get('/contact', (req, res) => {res.render('contact')});
app.get('/post', (req, res) => {res.render('post')});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
