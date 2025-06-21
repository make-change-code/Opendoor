#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the main MCP server file
const mcpServerPath = join(__dirname, '..', 'dist', 'index.js');

// Set environment variables for STDIO mode
process.env.MCP_TRANSPORT = 'stdio';
process.env.NODE_ENV = 'production';
process.env.LOG_LEVEL = 'error';

// Import and run the server directly
import(mcpServerPath).catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
