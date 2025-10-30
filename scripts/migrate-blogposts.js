require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await BlogPost.updateMany({}, { $set: { type: 'exercise', solution: null } });
    console.log('Migration complete!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Migration failed:', err);
    mongoose.disconnect();
  });