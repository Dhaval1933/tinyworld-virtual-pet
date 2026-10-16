const app = require('./app');
const connectDB = require('./config/db');
const { PORT, NODE_ENV } = require('./config/env');

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🌍 TinyWorld server running on port ${PORT} [${NODE_ENV}]`);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
