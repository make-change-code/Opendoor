#!/usr/bin/env node

// Test the actual opendoor server with minimal services
process.env.LOG_LEVEL = 'error';
process.env.SKIP_HEAVY_INIT = 'true';

import('./dist/index.js').then(() => {
  console.error('Server should be running now...');
}).catch((error) => {
  console.error('Failed to start server:', error);
});
