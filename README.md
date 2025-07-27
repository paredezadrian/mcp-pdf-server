# MCP PDF Server

A secure Model Context Protocol (MCP) server built with Node.js/TypeScript that allows AI agents to safely read PDF files and extract text, metadata, or page counts. Uses `pdf-parse` for reliable PDF processing.

## Features

- 🔒 **Secure by Design**: Built-in security measures to prevent directory traversal, SSRF attacks, and resource exhaustion
- 📄 **PDF Processing**: Extract text, metadata, and page counts from PDF files
- 🌐 **Dual Source Support**: Process both local files and remote URLs
- 🛡️ **Input Validation**: Comprehensive validation of file paths, URLs, and file types
- ⚡ **Fast & Reliable**: Uses the proven `pdf-parse` library for consistent results
- 🔧 **Configurable**: Customizable security settings and working directories
- 📊 **MCP Compliant**: Full Model Context Protocol implementation

## Installation

### Using npm (Recommended)

**Global Installation:**
```bash
npm install -g mcp-pdf-server
```

**Local Installation:**
```bash
npm install mcp-pdf-server
```

**Run without installing (using npx):**
```bash
npx mcp-pdf-server --help
npx mcp-pdf-server --working-directory ./pdfs
```

**NPM Package:** https://www.npmjs.com/package/mcp-pdf-server

### From Source

```bash
git clone https://github.com/paredezadrian/mcp-pdf-server.git
cd mcp-pdf-server
npm install
npm run build
npm link
```

## Usage

### As MCP Server

Configure your MCP client to use the server:

**If installed globally:**
```json
{
  "mcpServers": {
    "pdf-server": {
      "command": "mcp-pdf-server",
      "args": ["--working-directory", "/path/to/pdfs"],
      "name": "PDF Processing Server"
    }
  }
}
```

**Using npx (no installation required):**
```json
{
  "mcpServers": {
    "pdf-server": {
      "command": "npx",
      "args": ["mcp-pdf-server", "--working-directory", "/path/to/pdfs"],
      "name": "PDF Processing Server"
    }
  }
}
```

### Command Line Options

```bash
mcp-pdf-server [OPTIONS]

OPTIONS:
  --working-directory, --cwd <path>    Set working directory for local files
  --max-file-size <bytes>              Maximum file size in bytes (default: 52428800)
  --timeout <ms>                       Download timeout in milliseconds (default: 30000)
  --help, -h                           Show help message
  --version, -v                        Show version number
```

## Available Tools

### 1. extract-text

Extract text content from a PDF file.

**Parameters:**
- `source` (string): PDF file path or URL
- `startPage` (number, optional): Start page number (1-based)
- `endPage` (number, optional): End page number (1-based)
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads in milliseconds

**Example:**
```json
{
  "tool": "extract-text",
  "arguments": {
    "source": "./documents/report.pdf",
    "startPage": 1,
    "endPage": 5
  }
}
```

### 2. extract-metadata

Extract metadata information from a PDF file.

**Parameters:**
- `source` (string): PDF file path or URL
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads in milliseconds

**Example:**
```json
{
  "tool": "extract-metadata",
  "arguments": {
    "source": "https://example.com/document.pdf"
  }
}
```

### 3. get-page-count

Get the total number of pages in a PDF file.

**Parameters:**
- `source` (string): PDF file path or URL
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads in milliseconds

### 4. extract-all

Extract text, metadata, and page count in one operation.

**Parameters:**
- `source` (string): PDF file path or URL
- `startPage` (number, optional): Start page number (1-based)
- `endPage` (number, optional): End page number (1-based)
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads in milliseconds

## Security Features

### File System Security
- **Directory Traversal Protection**: Prevents access to files outside the working directory
- **Path Normalization**: Safely handles relative paths and symbolic links
- **File Type Validation**: Only processes `.pdf` files
- **Size Limits**: Configurable maximum file size (default: 50MB)

### Network Security
- **URL Validation**: Validates URL format and protocol (HTTP/HTTPS only)
- **SSRF Protection**: Blocks private IP addresses and localhost
- **Domain Filtering**: Configurable blocked domains list
- **Timeout Protection**: Prevents hanging downloads
- **Content-Type Validation**: Ensures downloaded content is actually a PDF

### Resource Protection
- **Memory Limits**: Prevents processing of excessively large files
- **Timeout Controls**: Configurable timeouts for all operations
- **Error Handling**: Graceful error handling without information leakage

## Configuration

### Default Security Settings

```typescript
{
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedExtensions: ['.pdf'],
  allowedMimeTypes: ['application/pdf'],
  downloadTimeout: 30000, // 30 seconds
  allowedProtocols: ['http:', 'https:'],
  blockedDomains: [
    'localhost', '127.0.0.1', '0.0.0.0', '::1',
    '10.', '172.16.', '192.168.'
  ],
  maxUrlLength: 2048
}
```

### Environment Variables

- `MCP_PDF_WORKING_DIR`: Default working directory
- `MCP_PDF_MAX_FILE_SIZE`: Maximum file size in bytes
- `MCP_PDF_TIMEOUT`: Default timeout in milliseconds

## Development

### Setup

```bash
git clone https://github.com/paredezadrian/mcp-pdf-server.git
cd mcp-pdf-server
npm install
```

### Scripts

```bash
npm run dev          # Run in development mode
npm run build        # Build TypeScript
npm run start        # Run built version
npm run test         # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Testing

```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) for PDF processing capabilities
- [TypeScript MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) for the MCP implementation
