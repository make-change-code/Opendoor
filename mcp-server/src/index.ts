#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Logger } from './utils/Logger.js';
import { ConfigService } from './services/ConfigService.js';
import { SessionManager } from './session/SessionManager.js';
import { LocalExecutionManager } from './container/LocalExecutionManager.js';
import { SecurityManager } from './security/SecurityManager.js';
import { HealthService } from './services/HealthService.js';
import { executeCodeTool } from './tools/ExecuteCodeTool.js';
import { createVSCodeSessionTool } from './tools/CreateVSCodeSessionTool.js';
import { createPlaywrightSessionTool } from './tools/CreatePlaywrightSessionTool.js';
import { manageSessionsTool } from './tools/ManageSessionsTool.js';
import { systemHealthTool } from './tools/SystemHealthTool.js';

const logger = Logger.getInstance();

// Service dependencies container
export interface ServiceContainer {
  sessionManager: SessionManager;
  executionManager: LocalExecutionManager;
  securityManager: SecurityManager;
  configService: ConfigService;
  healthService: HealthService;
}

let services: ServiceContainer | null = null;

async function initializeServices(): Promise<ServiceContainer> {
  const startTime = Date.now();
  logger.info('🚀 Starting Opendoor MCP Server initialization...');

  try {
    // Initialize services in parallel for faster boot time
    const [
      configService,
      sessionManager,
      executionManager,
      securityManager,
      healthService
    ] = await Promise.all([
      Promise.resolve(new ConfigService()),
      new SessionManager().initialize(),
      new LocalExecutionManager().initialize(),
      Promise.resolve(new SecurityManager()),
      Promise.resolve(new HealthService())
    ]);

    const initTime = Date.now() - startTime;
    logger.info(`✅ All services initialized in ${initTime}ms`);

    return {
      sessionManager,
      executionManager,
      securityManager,
      configService,
      healthService
    };
  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    throw error;
  }
}

function createServer(): Server {
  const server = new Server(
    {
      name: "opendoor-mcp",
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
    return {
      tools: [
        executeCodeTool.definition,
        createVSCodeSessionTool.definition,
        createPlaywrightSessionTool.definition,
        manageSessionsTool.definition,
        systemHealthTool.definition,
      ],
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!services) {
      throw new Error('Services not initialized');
    }

    const { name, arguments: args } = request.params;

    switch (name) {
      case 'execute_code':
        return await executeCodeTool.execute(args, services);
      
      case 'create_vscode_session':
        return await createVSCodeSessionTool.execute(args, services);
      
      case 'create_playwright_session':
        return await createPlaywrightSessionTool.execute(args, services);
      
      case 'manage_sessions':
        return await manageSessionsTool.execute(args, services);
      
      case 'system_health':
        return await systemHealthTool.execute(args, services);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}

async function main(): Promise<void> {
  try {
    // Initialize services first
    services = await initializeServices();

    // Create and configure MCP server
    const server = createServer();

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      try {
        if (services) {
          await Promise.all([
            services.sessionManager.cleanup(),
            services.executionManager.cleanup()
          ]);
        }
        
        await server.close();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error(`Error during shutdown: ${error}`);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Unhandled rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Start the MCP server with STDIO transport
    logger.info('🎉 Starting Opendoor MCP Server (STDIO mode)');
    logger.info('🔧 Multi-language code execution environment ready');
    logger.info('🖥️  VS Code integration enabled');
    logger.info('🎭 Playwright browser automation ready');
    
    const transport = new StdioServerTransport();
    await server.connect(transport);

  } catch (error) {
    logger.error('💥 Failed to start server:', error);
    process.exit(1);
  }
}

// Export for testing
export { services };

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}
