require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const app = express();

// Production environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const winston = require('winston');
const morgan = require('morgan');
// 🔒 Redirect middleware (place this FIRST)
app.use((req, res, next) => {
  if (req.headers.host === 'mathematiques-bac.org') {
    return res.redirect(301, 'https://www.mathematiques-bac.org' + req.url);
  }
  next();
});
// After loading env, add quick diagnostics
console.log('=== Startup diagnostics ===');
const envKeys = Object.keys(process.env);
console.log('Env vars count:', envKeys.length);

// Check critical env vars presence (mask values)
function mask(v) { 
  if (!v) return '<MISSING>'; 
  return v.length > 8 ? v.slice(0, 4) + '...' + v.slice(-4) : '*****'; 
}

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'present' : '<MISSING>');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'present' : '<MISSING>');
console.log('RECAPTCHA_SITE_KEY:', process.env.RECAPTCHA_SITE_KEY ? 'present' : '<MISSING>');
console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY ? 'present' : '<MISSING>');
console.log('SMTP_USER:', process.env.SMTP_USER ? mask(process.env.SMTP_USER) : '<MISSING>');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'present' : '<MISSING>');
console.log('PORT (env):', process.env.PORT || '(not set, using default)');
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('=== End diagnostics ===\n');

// Configure Winston logger
const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'clean-blog' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console logging in development
if (!isProduction) {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Enable gzip compression
app.use(compression());

// Request logging
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Security middleware - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://use.fontawesome.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://use.fontawesome.com", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://polyfill.io", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://www.google.com", "https://www.gstatic.com"],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "https://polyfill.io", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://www.google.com", "https://www.gstatic.com"],
      scriptSrcAttr: ["'unsafe-inline'", "'unsafe-hashes'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://www.google-analytics.com", "https://www.googletagmanager.com", "https://analytics.google.com"],
      frameSrc: ["'self'", "https://www.google.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["'self'", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// HTTPS redirect middleware for production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// CORS configuration
app.use(cors({
  origin: isProduction ? (process.env.CORS_ORIGIN || false) : ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-blog-database';
mongoose.set('strictQuery', true);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Middlewares setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use(express.static('public', {
  maxAge: isProduction ? '1d' : 0,
  etag: true,
  lastModified: true
}));

// Session middleware setup
const session = require('express-session');
const sessionConfig = require('./config/session');
app.use(session(sessionConfig));

// Authentication middleware
const { checkAuth } = require('./middleware/authMiddleware');
const { checkAdmin } = require('./middleware/adminMiddleware');
app.use(checkAuth);
app.use(checkAdmin);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Set view engine
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

// Routes
const blogRoutes = require('./routes/blog');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
app.use('/', blogRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Contact routes
const contactController = require('./controllers/contactController');
const { validateContactForm } = require('./middleware/contactMiddleware');
app.get('/contact', contactController.showContact);
app.post('/contact', validateContactForm, contactController.sendMessage);

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).json(healthcheck);
  }
});

// Other routes
app.get('/about', (req, res) => res.render('about'));

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port} (listening on 0.0.0.0 - all interfaces)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Ready to accept connections!`);
});
