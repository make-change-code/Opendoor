#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

console.error('Starting minimal MCP server test...');

const server = new Server(
  {
    name: "opendoor-mcp-test",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error('Received tools/list request');
  return {
    tools: [
      {
        name: "test_tool",
        description: "A test tool",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.error('Received tool call:', request.params.name);
  return {
    content: [
      {
        type: "text",
        text: "Test tool executed successfully"
      }
    ]
  };
});

console.error('Connecting to STDIO transport...');
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Server connected and ready');
