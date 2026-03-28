require('dotenv').config();
const express = require('express');

const app = express();

// Config via env
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`[INFO] Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log('[INFO] HTTP server closed');
    process.exit(0);
  });

  // fallback for force shutdown
  setTimeout(() => {
    console.error('[ERROR] Force shutdown');
    process.exit(1);
  }, 10000);
};

// Capture signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle uncaught errors (log only)
process.on('uncaughtException', (err) => {
  console.error('[ERROR] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[ERROR] Unhandled Rejection:', reason);
});

module.exports = app;
