require('dotenv').config();
const express = require('express');
const app = express();
const fileUpload=require('express-fileupload');
const mongoose=require('mongoose');
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
//Middlewares setup.
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// set view engine
//const ejs = require('ejs');
app.set('view engine','ejs');
//setting the routes
const blogRoutes=require('./routes/blog');
const userRoutes=require('./routes/users');
app.use('/',blogRoutes);
app.use('/users',userRoutes);
const port = process.env.PORT || 4000;
app.get('/about', (req, res) => {res.render('about')});
app.get('/contact', (req, res) => {res.render('contact')});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
