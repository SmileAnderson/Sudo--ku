// server.js - Complete modified Express server with authentication
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const complianceRoutes = require('./routes/compliance.js');
const incidentRoutes = require('./routes/incidents.js');
const auditRoutes = require('./routes/audit.js');
const notificationRoutes = require('./routes/notifications.js');
const { router: authRoutes } = require('./routes/auth.js');

// Import middleware
const dataStorage = require('./middleware/dataStorage');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    },
  },
}));

// Rate limiting with different limits for different endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// CORS configuration with detailed settings
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://your-domain.com', 'https://cybercare.md'] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware with size limits
app.use(bodyParser.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(bodyParser.urlencoded({ 
  extended: true, 
  limit: '10mb'
}));

// Data storage middleware - Initialize data files
app.use(dataStorage.initializeDataFiles);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`${timestamp} - ${method} ${url} - IP: ${ip}`);
  
  // Log request body for debugging (exclude sensitive data)
  if (method === 'POST' || method === 'PUT') {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.mfaCode) sanitizedBody.mfaCode = '[REDACTED]';
    console.log(`Request body:`, sanitizedBody);
  }
  
  next();
});

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      database: 'connected', // JSON file storage
      email: process.env.EMAIL_USER ? 'configured' : 'not-configured'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Development route for testing
if (process.env.NODE_ENV === 'development') {
  app.get('/api/test', (req, res) => {
    res.json({
      message: 'CyberCare API is running!',
      timestamp: new Date().toISOString(),
      availableEndpoints: [
        'GET /api/health',
        'POST /api/auth/login',
        'POST /api/auth/verify-mfa',
        'GET /api/compliance',
        'GET /api/incidents',
        'GET /api/notifications'
      ]
    });
  });
}

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong. Please try again later.',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  } else {
    res.status(error.status || 500).json({
      error: 'Internal server error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler for API routes - Fixed wildcard pattern
app.use('/api', (req, res, next) => {
  // Only handle routes that haven't been matched by previous routes
  if (!res.headersSent) {
    res.status(404).json({
      error: 'Endpoint not found',
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`,
      availableEndpoints: [
     'GET /api/health',
        'POST /api/auth/login',
        'POST /api/auth/register',
        'POST /api/auth/verify-mfa',
        'POST /api/auth/resend-mfa',
        'POST /api/auth/logout',
        'GET /api/compliance',
        'PUT /api/compliance/check',
        'GET /api/incidents',
        'POST /api/incidents',
        'GET /api/audit/status',
        'POST /api/audit/start',
        'GET /api/notifications'
      ],
      timestamp: new Date().toISOString()
    });
  } else {
    next();
  }
});

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  
  // Close server
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed successfully');
    
    // Close database connections, cleanup, etc.
    // In this case, we're using JSON files, so no cleanup needed
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

// Start server
const server = app.listen(PORT, () => {
  console.log('🚀 CyberCare Backend Server Started');
  console.log('=====================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Authentication: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured (check EMAIL_USER)'}`);
  console.log('=====================================');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🛠️  Development mode features:');
    console.log(`   📊 Test endpoint: http://localhost:${PORT}/api/test`);
    console.log(`   📝 Detailed error messages enabled`);
    console.log(`   🔍 Request logging enabled`);
  }
});

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server gracefully
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Export app for testing
module.exports = app;