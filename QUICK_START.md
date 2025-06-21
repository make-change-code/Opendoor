# 🚀 Quick Start Guide

## Port Configuration
- **Main MCP Server**: http://localhost:50063
- **Configuration UI**: http://localhost:50064
- **Redis**: localhost:6379 (internal only)

## 1. Start the Server

### Option A: Docker Compose (Recommended)
```bash
git clone https://github.com/make-change-code/Opendoor.git
cd Opendoor
docker-compose -f docker-compose.production.yml up -d
```

### Option B: Direct Docker Run
```bash
docker run -d --name opendoor-mcp \
  -p 50063:50063 \
  -e MCP_TRANSPORT=sse \
  ghcr.io/make-change-code/opendoor/opendoor-mcp:latest
```

## 2. Verify Server is Running
```bash
curl http://localhost:50063/health
```

## 3. OpenHands Configuration

### SSE Configuration (Recommended)
```json
{
  "sse_servers": [
    "http://localhost:50063/sse"
  ],
  "stdio_servers": []
}
```

### STDIO Configuration
```json
{
  "sse_servers": [],
  "stdio_servers": [
    {
      "name": "opendoor",
      "command": "docker",
      "args": [
        "run", "-i", "--rm", "-p", "50063:50063",
        "ghcr.io/make-change-code/opendoor/opendoor-mcp:latest"
      ]
    }
  ]
}
```

## Available Tools

1. **execute_code** - Run code in 15+ languages with isolation
2. **create_vscode_session** - Launch VS Code development environments
3. **create_playwright_session** - Browser automation with Playwright
4. **manage_sessions** - Session lifecycle management
5. **system_health** - Monitor system status

## Support

- Documentation: http://localhost:50063
- Issues: https://github.com/make-change-code/Opendoor/issues
- OpenHands Configs: See `openhands-configs.md`
