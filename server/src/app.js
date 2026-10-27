const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const corsMiddleware = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const { apiLimiter } = require('./middleware/rateLimiter');
const { NODE_ENV } = require('./config/env');

const app = express();

// ─── Security ───
app.use(helmet());
app.use(corsMiddleware);

// ─── Parsing ───
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ───
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ───
app.use('/api', apiLimiter);

// ─── Health Check ───
app.get(['/api/health', '/api/v1/health'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.json({
    success: true,
    message: 'TinyWorld API is running 🌍',
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/onboarding', require('./routes/onboarding'));
app.use('/api/v1/world', require('./routes/world'));
app.use('/api/v1/pet', require('./routes/pet'));
app.use('/api/v1/shop', require('./routes/shop'));
app.use('/api/v1/activities', require('./routes/activities'));
app.use('/api/v1/progress', require('./routes/progress'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/subscription', require('./routes/subscription'));

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Error Handler ───
app.use(errorHandler);

module.exports = app;
