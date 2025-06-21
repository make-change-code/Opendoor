# 🚪 Opendoor MCP Server

[![Build and Push Docker Images](https://github.com/make-change-code/Opendoor/actions/workflows/docker-build.yml/badge.svg)](https://github.com/make-change-code/Opendoor/actions/workflows/docker-build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-grade Model Context Protocol (MCP) server that provides secure code execution, VS Code integration, and browser automation capabilities for Large Language Models and OpenHands.

## 🌟 Features

- **🔌 Model Context Protocol**: Full MCP implementation with SSE and STDIO transports
- **🐍 Multi-Language Support**: Execute Python, JavaScript, TypeScript, Bash, and more
- **🖥️ VS Code Integration**: Launch development environments on-demand
- **🎭 Browser Automation**: Playwright integration for web testing and automation
- **🔒 Enterprise Security**: Rate limiting, input validation, and secure container isolation
- **📊 Monitoring**: Health checks, metrics, and comprehensive logging
- **⚡ High Performance**: Fast boot times and optimized resource usage
- **🐳 Docker Ready**: Production-ready containerization with multi-arch support

## 🚀 Quick Start

### NPX (Recommended)
```bash
# Run directly with npx (no installation required)
npx opendoor-mcp

# Or install globally first
npm install -g opendoor-mcp
opendoor-mcp
```

### Local Development
```bash
git clone https://github.com/make-change-code/Opendoor.git
cd Opendoor
npm install
npm run build
npm start
```



## 🔗 OpenHands Integration

**Important**: OpenHands requires both `sse_servers` and `stdio_servers` arrays in the configuration.

### STDIO Configuration (npx)
```json
{
  "sse_servers": [],
  "stdio_servers": [
    {
      "name": "opendoor",
      "command": "npx",
      "args": ["-y", "opendoor-mcp"]
    }
  ]
}
```

### STDIO Configuration (global install)
```json
{
  "sse_servers": [],
  "stdio_servers": [
    {
      "name": "opendoor",
      "command": "opendoor-mcp"
    }
  ]
}
```

### Testing Your Configuration
1. Test the package: `npx opendoor-mcp` (should start and wait for STDIO input)
2. Press Ctrl+C to exit
3. Apply configuration to OpenHands and test connection

## 🛠️ Available Tools

| Tool | Description |
|------|-------------|
| `execute_code` | Execute code in multiple languages with secure sandboxing |
| `create_vscode_session` | Launch VS Code development environments |
| `create_playwright_session` | Start browser automation sessions |
| `manage_sessions` | List, monitor, and cleanup active sessions |
| `system_health` | Monitor system resources and service health |

## 📚 Resources

- **system_config**: Server configuration and capabilities
- **usage_guide**: Comprehensive usage instructions and examples

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LLM Client    │    │   MCP Server    │    │ Local Execution │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Claude/GPT  │◄┼────┼►│ Opendoor    │◄┼────┼►│ Python Venv │ │
│ │ Desktop     │ │    │ │ MCP Server  │ │    │ │ Node.js     │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ │ Java/Go/Rust│ │
│                 │    │                 │    │ │ Code Server │ │
│ SSE/STDIO       │    │ Redis Session   │    │ │ Playwright  │ │
│ Transport       │    │ Management      │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Repository Structure

```
Opendoor/
├── mcp-server/              # Main MCP server implementation
│   ├── src/                 # TypeScript source code
│   ├── docker/              # Docker configuration files
│   ├── Dockerfile           # MCP server Dockerfile
│   └── package.json         # Dependencies and scripts
├── containers/              # Container definitions
│   ├── base/                # Base container images
│   ├── languages/           # Language-specific containers
│   ├── playwright/          # Browser automation containers
│   └── vscode/              # VS Code development containers
├── frontend/                # Web interface (optional)
├── .github/workflows/       # CI/CD pipelines
├── Dockerfile.opendoor-mcp  # Production Dockerfile
└── docker-compose.production.yml
```

## 🔧 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/make-change-code/Opendoor.git
cd Opendoor

# Install dependencies
npm install

# Start in development mode
npm run dev

# Build for production
npm run build
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_TRANSPORT` | `stdio` | Transport type (always stdio) |
| `NODE_ENV` | `production` | Environment mode |
| `LOG_LEVEL` | `error` | Logging level |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL (if needed) |

## 🐳 Docker Images

### Available Tags

- `latest` - Latest stable release
- `main` - Latest from main branch
- `v1.0.0` - Specific version tags

### Multi-Architecture Support

- `linux/amd64` - Intel/AMD 64-bit
- `linux/arm64` - ARM 64-bit (Apple Silicon, ARM servers)

### Image Sizes

- **Production Image**: ~200MB (optimized Alpine-based)
- **Development Image**: ~300MB (includes dev tools)

## 🔒 Security Features

- **Container Isolation**: Secure Docker-in-Docker execution
- **Rate Limiting**: Configurable request rate limits
- **Input Validation**: Comprehensive input sanitization
- **Session Management**: Secure session handling with Redis
- **Resource Monitoring**: CPU and memory usage tracking
- **Audit Logging**: Comprehensive security event logging

## 📊 Monitoring & Observability

### Health Checks

```bash
# Basic health check
curl http://localhost:50063/health

# Detailed system status
curl http://localhost:50063/health | jq
```

### Metrics

- **Prometheus metrics**: Available at `/metrics`
- **Custom dashboards**: Grafana-compatible
- **Real-time monitoring**: WebSocket-based updates

### Logging

- **Structured logging**: JSON format with Winston
- **Log levels**: ERROR, WARN, INFO, DEBUG
- **Log rotation**: Automatic log file management

## 🚀 Production Deployment

### Railway Deployment (Recommended)

Use Railway for production deployment with automatic scaling and HTTPS.
- Docker-in-Docker (DIND) configuration
- Automatic HTTPS and scaling
- Environment variable management
- Monitoring and logging
- Cost optimization

### Traditional Deployment

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for comprehensive production deployment guide including:

- Docker Compose configurations
- Kubernetes manifests
- Reverse proxy setup (Nginx, Traefik)
- SSL/TLS configuration
- Scaling strategies
- Monitoring setup

## 🔄 CI/CD Pipeline

### Automated Workflows

- **Build & Test**: Automated testing on every PR
- **Security Scanning**: Vulnerability and dependency scanning
- **Docker Publishing**: Multi-arch image builds to GHCR
- **Documentation**: Auto-generated API docs

### Quality Gates

- ✅ Unit and integration tests
- ✅ Security vulnerability scanning
- ✅ Code quality analysis
- ✅ Docker image security scanning
- ✅ Performance benchmarks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure Docker builds pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Configuration UI**: [http://localhost:50064](http://localhost:50064) (when running)
- **Documentation**: [http://localhost:50063](http://localhost:50063) (when running)
- **Issues**: [GitHub Issues](https://github.com/make-change-code/Opendoor/issues)
- **Security**: Report security issues via GitHub Security Advisories

## 🔧 Troubleshooting

### Common Issues
- **Port conflicts**: Ensure ports 50063, 50064, and 6379 are available
- **Docker issues**: Check Docker is running and has sufficient resources
- **OpenHands connection**: Verify both `sse_servers` and `stdio_servers` arrays are present
- **Health check fails**: Check Redis is running and accessible

### Debug Steps
1. Check container logs: `docker logs opendoor-mcp`
2. Verify Redis: `redis-cli -p 6379 ping`
3. Test endpoints: `curl http://localhost:50063/health`
4. Check frontend: `curl http://localhost:50064`

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP Framework](https://github.com/ronangrant/mcp-framework) - Framework foundation
- [Docker](https://docker.com/) - Containerization platform
- [Node.js](https://nodejs.org/) - Runtime environment

## 📈 Roadmap

- [ ] Kubernetes operator
- [ ] WebAssembly runtime support
- [ ] Advanced code analysis tools
- [ ] Multi-tenant support
- [ ] Plugin system
- [ ] GraphQL API
- [ ] Real-time collaboration features

---

**Made with ❤️ by the Opendoor Team**

*Empowering LLMs with secure, scalable, and production-ready code execution capabilities.*