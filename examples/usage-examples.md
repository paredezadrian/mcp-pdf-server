# Usage Examples

This document provides examples of how to use the MCP PDF Server with various MCP clients.

## Basic Tool Usage

### Extract Text from Local PDF

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "./documents/report.pdf"
  }
}
```

**Response:**
```
This is the extracted text from the PDF document...
```

### Extract Text from Specific Pages

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "./documents/report.pdf",
    "startPage": 2,
    "endPage": 5
  }
}
```

### Extract Text from URL

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "https://example.com/document.pdf",
    "timeout": 60000
  }
}
```

### Get PDF Metadata

```json
{
  "tool": "extract-metadata",
  "arguments": {
    "source": "./documents/report.pdf"
  }
}
```

**Response:**
```json
{
  "title": "Annual Report 2024",
  "author": "Company Name",
  "subject": "Financial Report",
  "creator": "Microsoft Word",
  "producer": "Microsoft: Print To PDF",
  "creationDate": "2024-01-15T10:30:00.000Z",
  "modificationDate": "2024-01-15T10:35:00.000Z",
  "keywords": "annual, report, financial, 2024"
}
```

### Get Page Count

```json
{
  "tool": "get-page-count",
  "arguments": {
    "source": "./documents/report.pdf"
  }
}
```

**Response:**
```
Total pages: 25
```

### Extract All Information

```json
{
  "tool": "extract-all",
  "arguments": {
    "source": "./documents/report.pdf",
    "startPage": 1,
    "endPage": 3
  }
}
```

**Response:**
```json
{
  "source": "./documents/report.pdf",
  "pageCount": 25,
  "metadata": {
    "title": "Annual Report 2024",
    "author": "Company Name",
    "creationDate": "2024-01-15T10:30:00.000Z"
  },
  "text": null,
  "pageTexts": [
    {
      "page": 1,
      "text": "Page 1 content..."
    },
    {
      "page": 2,
      "text": "Page 2 content..."
    },
    {
      "page": 3,
      "text": "Page 3 content..."
    }
  ]
}
```

## Error Handling Examples

### File Not Found

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "./nonexistent.pdf"
  }
}
```

**Response:**
```
Error: File not found
```

### Invalid URL

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "http://localhost/document.pdf"
  }
}
```

**Response:**
```
Error: Blocked domain: localhost
```

### File Too Large

```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "./huge-document.pdf"
  }
}
```

**Response:**
```
Error: File too large: 104857600 bytes. Maximum: 52428800 bytes
```

## Advanced Configuration Examples

### Custom Working Directory

```bash
mcp-pdf-server --working-directory /home/user/documents
```

### Custom File Size Limit (10MB)

```bash
mcp-pdf-server --max-file-size 10485760
```

### Custom Download Timeout (60 seconds)

```bash
mcp-pdf-server --timeout 60000
```

### Combined Configuration

```bash
mcp-pdf-server \
  --working-directory /home/user/pdfs \
  --max-file-size 20971520 \
  --timeout 45000
```

## Integration with Popular MCP Clients

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdf-processor": {
      "command": "mcp-pdf-server",
      "args": ["--working-directory", "/Users/username/Documents"],
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
  command: 'mcp-pdf-server',
  args: ['--working-directory', './documents']
});

const client = new Client({
  name: 'pdf-client',
  version: '1.0.0'
});

await client.connect(transport);

// Extract text from PDF
const result = await client.callTool({
  name: 'extract-text',
  arguments: {
    source: './report.pdf',
    startPage: 1,
    endPage: 5
  }
});

console.log(result.content[0].text);
```

## Security Best Practices

1. **Always use a working directory** to restrict file access:
   ```bash
   mcp-pdf-server --working-directory /safe/pdf/directory
   ```

2. **Set appropriate file size limits** based on your needs:
   ```bash
   mcp-pdf-server --max-file-size 10485760  # 10MB
   ```

3. **Use reasonable timeouts** for URL downloads:
   ```bash
   mcp-pdf-server --timeout 30000  # 30 seconds
   ```

4. **Validate URLs** before processing - the server blocks private IPs but additional validation may be needed for your use case.

5. **Monitor resource usage** when processing large PDFs or many concurrent requests.
