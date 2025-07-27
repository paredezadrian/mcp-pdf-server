# Deployment Guide

This guide explains how to deploy and use the MCP PDF Server in various environments.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Run the Server

```bash
# Basic usage
npm start

# With custom options
node dist/index.js --working-directory ./pdfs --max-file-size 10485760
```

## Installation Methods

### Method 1: Global Installation

```bash
npm install -g .
mcp-pdf-server --help
```

### Method 2: Local Development

```bash
npm run dev
```

### Method 3: Docker (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdf-processor": {
      "command": "node",
      "args": ["/path/to/mcp-pdf-server/dist/index.js", "--working-directory", "/path/to/pdfs"],
      "name": "PDF Processor"
    }
  }
}
```

### Custom MCP Client

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['/path/to/dist/index.js', '--working-directory', './documents']
});

const client = new Client({
  name: 'pdf-client',
  version: '1.0.0'
});

await client.connect(transport);

// Use the tools
const result = await client.callTool({
  name: 'extract-text',
  arguments: { source: './report.pdf' }
});
```

## Environment Variables

You can use environment variables to set default values:

```bash
export MCP_PDF_WORKING_DIR="/path/to/pdfs"
export MCP_PDF_MAX_FILE_SIZE="52428800"
export MCP_PDF_TIMEOUT="30000"
```

## Security Configuration

### File System Security

- Always set a working directory to restrict file access
- Use appropriate file size limits based on your system resources
- Monitor disk space usage

### Network Security

- The server blocks private IP addresses by default
- URLs are validated for protocol and format
- Consider using a firewall for additional protection

### Resource Limits

```bash
# Limit memory usage (Linux/macOS)
ulimit -v 1048576  # 1GB virtual memory limit

# Run with limited resources
node --max-old-space-size=512 dist/index.js
```

## Monitoring and Logging

### Basic Logging

The server logs to stderr by default. Redirect for persistent logging:

```bash
node dist/index.js 2>> /var/log/mcp-pdf-server.log
```

### Process Management with PM2

```bash
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'mcp-pdf-server',
    script: 'dist/index.js',
    args: '--working-directory /path/to/pdfs',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/mcp-pdf-server-error.log',
    out_file: '/var/log/mcp-pdf-server-out.log',
    log_file: '/var/log/mcp-pdf-server-combined.log'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
```

## Performance Tuning

### Memory Optimization

```bash
# For large PDF processing
node --max-old-space-size=2048 dist/index.js

# For memory-constrained environments
node --max-old-space-size=256 dist/index.js
```

### Concurrent Processing

The server handles one request at a time by design for security. For higher throughput, run multiple instances:

```bash
# Run multiple instances on different ports (if using HTTP transport)
node dist/index.js --port 3001 &
node dist/index.js --port 3002 &
node dist/index.js --port 3003 &
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   npm install
   npm run build
   ```

2. **Permission denied errors**
   ```bash
   chmod +x dist/index.js
   ```

3. **PDF parsing errors**
   - Ensure the PDF is not corrupted
   - Check file size limits
   - Verify file permissions

4. **Network timeout errors**
   - Increase timeout value
   - Check network connectivity
   - Verify URL accessibility

### Debug Mode

```bash
# Enable debug logging
DEBUG=* node dist/index.js

# Node.js debugging
node --inspect dist/index.js
```

### Health Checks

Create a simple health check script:

```bash
#!/bin/bash
# health-check.sh

# Check if process is running
if pgrep -f "mcp-pdf-server" > /dev/null; then
    echo "MCP PDF Server is running"
    exit 0
else
    echo "MCP PDF Server is not running"
    exit 1
fi
```

## Backup and Recovery

### Configuration Backup

```bash
# Backup configuration
tar -czf mcp-pdf-server-config-$(date +%Y%m%d).tar.gz \
    package.json \
    tsconfig.json \
    examples/ \
    README.md
```

### Data Backup

```bash
# Backup working directory
rsync -av /path/to/pdfs/ /backup/pdfs/
```

## Updates and Maintenance

### Updating Dependencies

```bash
npm audit
npm update
npm run build
npm test
```

### Version Management

```bash
# Check current version
node dist/index.js --version

# Update version
npm version patch
npm run build
```

## Production Checklist

- [ ] Set appropriate working directory
- [ ] Configure file size limits
- [ ] Set up logging
- [ ] Configure process monitoring
- [ ] Test security restrictions
- [ ] Set up backups
- [ ] Configure health checks
- [ ] Document configuration
- [ ] Test disaster recovery
- [ ] Monitor resource usage
