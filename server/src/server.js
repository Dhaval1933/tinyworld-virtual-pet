const app = require('./app');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');
const mongoose = require('mongoose');

let server;

const start = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`🌍 TinyWorld server running on port ${PORT} [${NODE_ENV}]`);
  });
};

const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('🔒 HTTP server closed.');
      await mongoose.connection.close();
      console.log('📦 Database connection closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
});

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
