const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const BlogPost = require('../models/BlogPost');

async function updateAuthors() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const newAuthorId = '690348ec34fcf761b3d8d283'; // Your new user ObjectId

  const result = await BlogPost.updateMany(
    {},
    { $set: { author: newAuthorId } }
  );

  console.log('Update result:', result);

  await mongoose.disconnect();
}

updateAuthors().catch(err => {
  console.error('Error updating authors:', err);
  process.exit(1);
});
