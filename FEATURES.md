# MCP PDF Server - Feature Overview

## Core Features

### 🔒 Security First
- **Directory Traversal Protection**: Prevents access to files outside the working directory
- **SSRF Prevention**: Blocks private IP addresses and localhost for URL processing
- **File Type Validation**: Only processes `.pdf` files with proper MIME type checking
- **Size Limits**: Configurable maximum file size (default: 50MB)
- **Timeout Protection**: Prevents hanging operations with configurable timeouts
- **Input Sanitization**: Comprehensive validation of all inputs

### 📄 PDF Processing Capabilities
- **Text Extraction**: Extract full text or specific page ranges from PDFs
- **Metadata Extraction**: Retrieve document metadata (title, author, creation date, etc.)
- **Page Count**: Get total number of pages in a PDF
- **Dual Source Support**: Process both local files and remote URLs
- **Error Handling**: Graceful error handling with detailed error messages

### 🌐 MCP Protocol Compliance
- **Full MCP Implementation**: Complete Model Context Protocol server implementation
- **Tool Registration**: Four main tools for different PDF operations
- **Stdio Transport**: Standard input/output communication for MCP clients
- **Error Reporting**: Proper MCP error response formatting
- **Type Safety**: Full TypeScript implementation with strict type checking

## Available Tools

### 1. `extract-text`
**Purpose**: Extract text content from PDF files

**Parameters**:
- `source` (string): PDF file path or URL
- `startPage` (number, optional): Start page number (1-based)
- `endPage` (number, optional): End page number (1-based)
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads

**Use Cases**:
- Document content analysis
- Text search and indexing
- Content migration
- Data extraction for AI processing

### 2. `extract-metadata`
**Purpose**: Extract metadata information from PDF files

**Parameters**:
- `source` (string): PDF file path or URL
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads

**Returns**:
- Title, Author, Subject, Creator, Producer
- Creation and modification dates
- Keywords and other metadata

**Use Cases**:
- Document cataloging
- Metadata analysis
- Document management systems
- Compliance and auditing

### 3. `get-page-count`
**Purpose**: Get the total number of pages in a PDF

**Parameters**:
- `source` (string): PDF file path or URL
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads

**Use Cases**:
- Document size assessment
- Pagination planning
- Cost estimation for printing
- Document processing planning

### 4. `extract-all`
**Purpose**: Extract text, metadata, and page count in one operation

**Parameters**:
- `source` (string): PDF file path or URL
- `startPage` (number, optional): Start page number (1-based)
- `endPage` (number, optional): End page number (1-based)
- `maxFileSize` (number, optional): Maximum file size in bytes
- `timeout` (number, optional): Timeout for URL downloads

**Use Cases**:
- Comprehensive document analysis
- Single-call document processing
- Efficient batch operations
- Complete document information gathering

## Security Features

### File System Security
- **Working Directory Restriction**: All file operations are restricted to a specified working directory
- **Path Normalization**: Prevents directory traversal attacks using `../` sequences
- **File Extension Validation**: Only `.pdf` files are processed
- **File Size Limits**: Configurable maximum file size to prevent resource exhaustion
- **File Existence Checks**: Validates file existence and readability before processing

### Network Security
- **Protocol Validation**: Only HTTP and HTTPS protocols are allowed
- **Private IP Blocking**: Blocks access to private IP ranges (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
- **Localhost Blocking**: Prevents access to localhost and loopback addresses
- **URL Length Limits**: Prevents excessively long URLs
- **Content-Type Validation**: Validates that downloaded content is actually a PDF
- **Download Timeouts**: Prevents hanging downloads with configurable timeouts

### Resource Protection
- **Memory Limits**: Prevents processing of excessively large files
- **Timeout Controls**: All operations have configurable timeouts
- **Error Boundaries**: Comprehensive error handling prevents crashes
- **Resource Cleanup**: Proper cleanup of temporary resources

## Configuration Options

### Command Line Arguments
```bash
--working-directory <path>    # Set working directory for local files
--max-file-size <bytes>       # Maximum file size (default: 52428800)
--timeout <ms>                # Download timeout (default: 30000)
--help                        # Show help message
--version                     # Show version number
```

### Default Security Configuration
```typescript
{
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedExtensions: ['.pdf'],
  allowedMimeTypes: ['application/pdf'],
  downloadTimeout: 30000, // 30 seconds
  allowedProtocols: ['http:', 'https:'],
  blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0', '::1'],
  maxUrlLength: 2048
}
```

## Technical Architecture

### Core Components
1. **MCPPDFServer**: Main server class implementing MCP protocol
2. **PDFProcessor**: Handles PDF parsing and text extraction using pdf-parse
3. **SecurityValidator**: Validates file paths and URLs for security
4. **Type Definitions**: Comprehensive TypeScript types for all operations

### Dependencies
- **@modelcontextprotocol/sdk**: Official MCP TypeScript SDK
- **pdf-parse**: PDF parsing and text extraction
- **node-fetch**: HTTP client for URL downloads
- **zod**: Runtime type validation
- **mime-types**: MIME type detection

### Error Handling
- Comprehensive error catching and reporting
- Graceful degradation for invalid inputs
- Detailed error messages without information leakage
- Proper MCP error response formatting

## Performance Characteristics

### Memory Usage
- Efficient streaming for large files
- Automatic garbage collection
- Configurable memory limits
- Resource cleanup after processing

### Processing Speed
- Fast text extraction using pdf-parse
- Minimal overhead for metadata extraction
- Efficient page counting
- Optimized for batch operations

### Scalability
- Single-threaded by design for security
- Stateless operation for easy scaling
- Low resource footprint
- Suitable for containerization

## Integration Examples

### With Claude Desktop
```json
{
  "mcpServers": {
    "pdf-processor": {
      "command": "mcp-pdf-server",
      "args": ["--working-directory", "/path/to/pdfs"],
      "name": "PDF Processor"
    }
  }
}
```

### With Custom MCP Client
```typescript
const client = new Client({ name: 'pdf-client', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'mcp-pdf-server',
  args: ['--working-directory', './documents']
});
await client.connect(transport);
```

## Future Enhancements

### Planned Features
- OCR support for scanned PDFs
- Page-specific text extraction improvements
- Image extraction capabilities
- Batch processing support
- HTTP transport option
- Docker container support

### Performance Improvements
- Streaming text extraction
- Parallel processing options
- Caching mechanisms
- Memory optimization

### Security Enhancements
- Rate limiting
- Authentication support
- Audit logging
- Enhanced input validation
