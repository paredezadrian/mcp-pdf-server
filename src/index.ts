#!/usr/bin/env node

/**
 * MCP PDF Server - Main entry point
 * 
 * A secure MCP server for PDF processing that supports:
 * - Text extraction from local files and URLs
 * - Metadata extraction
 * - Page count retrieval
 * - Security validation and sandboxing
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MCPPDFServer } from './server.js';
import type { ServerConfig } from './types.js';
import { DEFAULT_SECURITY_CONFIG } from './types.js';

async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const config: Partial<ServerConfig> = {};

  // Simple argument parsing
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--working-directory':
      case '--cwd':
        if (nextArg && !nextArg.startsWith('--')) {
          config.workingDirectory = nextArg;
          i++; // Skip next argument
        }
        break;
      case '--max-file-size':
        if (nextArg && !nextArg.startsWith('--')) {
          const size = parseInt(nextArg);
          if (!isNaN(size)) {
            config.security = {
              ...DEFAULT_SECURITY_CONFIG,
              ...config.security,
              maxFileSize: size
            };
          }
          i++; // Skip next argument
        }
        break;
      case '--timeout':
        if (nextArg && !nextArg.startsWith('--')) {
          const timeout = parseInt(nextArg);
          if (!isNaN(timeout)) {
            config.security = {
              ...DEFAULT_SECURITY_CONFIG,
              ...config.security,
              downloadTimeout: timeout
            };
          }
          i++; // Skip next argument
        }
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        // eslint-disable-next-line no-fallthrough
      case '--version':
      case '-v':
        console.log('1.0.0');
        process.exit(0);
    }
  }

  try {
    // Create and start the MCP server
    const mcpServer = new MCPPDFServer(config);
    const server = mcpServer.getServer();

    // Use stdio transport for MCP communication
    const transport = new StdioServerTransport();
    
    // Connect the server to the transport
    await server.connect(transport);

    // Log startup message to stderr (stdout is used for MCP communication)
    console.error('MCP PDF Server started successfully');
    console.error(`Working directory: ${config.workingDirectory || process.cwd()}`);
    console.error(`Max file size: ${config.security?.maxFileSize || 52428800} bytes`);
    console.error(`Download timeout: ${config.security?.downloadTimeout || 30000}ms`);

  } catch (error) {
    console.error('Failed to start MCP PDF Server:', error);
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
MCP PDF Server v1.0.0

A secure Model Context Protocol server for PDF processing.

USAGE:
  mcp-pdf-server [OPTIONS]

OPTIONS:
  --working-directory, --cwd <path>    Set working directory for local files
  --max-file-size <bytes>              Maximum file size in bytes (default: 52428800)
  --timeout <ms>                       Download timeout in milliseconds (default: 30000)
  --help, -h                           Show this help message
  --version, -v                        Show version number

TOOLS:
  extract-text        Extract text content from PDF
  extract-metadata    Extract metadata from PDF
  get-page-count      Get total number of pages
  extract-all         Extract all information in one operation

EXAMPLES:
  # Start server with default settings
  mcp-pdf-server

  # Start server with custom working directory
  mcp-pdf-server --working-directory /path/to/pdfs

  # Start server with custom file size limit (10MB)
  mcp-pdf-server --max-file-size 10485760

SECURITY:
  - Local files are restricted to the working directory
  - URLs are validated to prevent SSRF attacks
  - File sizes are limited to prevent resource exhaustion
  - Only PDF files are processed
  - Private IP addresses and localhost are blocked for URLs

For more information, visit: https://github.com/yourusername/mcp-pdf-server
`);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
