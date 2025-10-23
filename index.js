require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const app = express();
const fileUpload=require('express-fileupload');
const mongoose=require('mongoose');

// Security middleware - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://polyfill.io",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for MathJax
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] // Replace with your actual domain in production
    : ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Use environment variable or default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-blog-database';
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

// Session middleware setup
const session = require('express-session');
const sessionConfig = require('./config/session');
app.use(session(sessionConfig));

// Authentication middleware - make user info available to all templates
const { checkAuth } = require('./middleware/authMiddleware');
const { checkAdmin } = require('./middleware/adminMiddleware');
app.use(checkAuth);
app.use(checkAdmin);

// set view engine
//const ejs = require('ejs');
app.set('view engine','ejs');
//setting the routes
const blogRoutes=require('./routes/blog');
const userRoutes=require('./routes/users');
const adminRoutes=require('./routes/admin');
app.use('/',blogRoutes);
app.use('/users',userRoutes);
app.use('/admin',adminRoutes);
const port = process.env.PORT || 4000;
app.get('/about', (req, res) => {res.render('about')});
app.get('/contact', (req, res) => {res.render('contact')});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
