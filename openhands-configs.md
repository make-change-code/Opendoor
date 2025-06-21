# OpenHands MCP Configuration Examples

This document provides configuration examples for connecting OpenHands to the Opendoor MCP server with both SSE and STDIO transports.

## Important Notes

- Each configuration should have BOTH `sse_servers` and `stdio_servers` arrays
- Only the array for the specific transport should be populated
- The other array should remain empty but present
- Replace `localhost:50063` with your actual server URL

## SSE Configuration (Server-Sent Events)

For real-time streaming connections to OpenHands:

```json
{
  "sse_servers": [
    "http://localhost:50063/sse"
  ],
  "stdio_servers": []
}
```

### Complete SSE Configuration Example

```json
{
  "mcpServers": {
    "opendoor": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/client-sse"],
      "env": {
        "MCP_SERVER_URL": "http://localhost:50063/sse"
      }
    }
  },
  "sse_servers": [
    "http://localhost:50063/sse"
  ],
  "stdio_servers": []
}
```

## STDIO Configuration (Standard Input/Output)

For command-line style interactions with OpenHands:

```json
{
  "sse_servers": [],
  "stdio_servers": [
    {
      "name": "opendoor",
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-p", "50063:3000",
        "ghcr.io/make-change-code/opendoor/opendoor-mcp:latest"
      ]
    }
  ]
}
```

### Alternative STDIO Configuration (Local Install)

```json
{
  "sse_servers": [],
  "stdio_servers": [
    {
      "name": "opendoor",
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/opendoor/mcp-server",
      "env": {
        "NODE_ENV": "production",
        "PORT": "50063",
        "REDIS_URL": "redis://localhost:6379"
      }
    }
  ]
}
```

## Production Configuration (with HTTPS)

For production deployments with SSL:

```json
{
  "sse_servers": [
    "https://your-domain.com:50063/sse"
  ],
  "stdio_servers": [],
  "ssl": {
    "verify": true,
    "ca_bundle": "/path/to/ca-bundle.crt"
  }
}
```

## Multi-Server Configuration

You can configure multiple MCP servers (both arrays present):

```json
{
  "sse_servers": [
    "http://localhost:50063/sse",
    "http://other-server.com:3000/sse"
  ],
  "stdio_servers": [
    {
      "name": "local-tools",
      "command": "python",
      "args": ["-m", "mcp_tools.server"]
    }
  ]
}
```

## Environment-Specific Configurations

### Development Environment

```json
{
  "sse_servers": [
    "http://localhost:50063/sse"
  ],
  "stdio_servers": [],
  "debug": true,
  "log_level": "debug"
}
```

### Production Environment

```json
{
  "sse_servers": [
    "https://opendoor-mcp.your-domain.com/sse"
  ],
  "stdio_servers": [],
  "timeout": 30000,
  "retry_attempts": 3,
  "rate_limit": {
    "requests_per_minute": 60
  }
}
```

## Available Tools

When connected, OpenHands will have access to these tools:

- `execute_code` - Execute code in 15+ programming languages
- `create_vscode_session` - Launch VS Code development environments  
- `create_playwright_session` - Create browser automation sessions
- `manage_sessions` - List, monitor, and cleanup active sessions
- `system_health` - Monitor system resources and service health

## Testing Your Configuration

1. Start the Opendoor MCP server:
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

2. Verify the server is running:
   ```bash
   curl http://localhost:50063/health
   ```

3. Test the SSE endpoint:
   ```bash
   curl http://localhost:50063/sse
   ```

4. Apply your configuration to OpenHands and test the connection.

## Troubleshooting

- Ensure port 50063 is accessible from OpenHands
- Check that both `sse_servers` and `stdio_servers` arrays are present
- Verify the MCP server is healthy via the `/health` endpoint
- Check logs for connection errors
- Ensure Redis is running on port 6379 (default)
