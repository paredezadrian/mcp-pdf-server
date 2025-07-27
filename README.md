# MCP PDF Server for Augment Code

A secure Model Context Protocol (MCP) server built with Node.js/TypeScript specifically optimized for **Augment Code's Agent platform**. Allows Augment Agent to safely read PDF files and extract text, metadata, or page counts for documentation analysis, code review, and development workflow integration.

## Features

- 🤖 **Augment Agent Integration**: Seamlessly integrates with Augment Code's Agent for automated document processing
- 🔒 **Secure by Design**: Built-in security measures to prevent directory traversal, SSRF attacks, and resource exhaustion
- 📄 **PDF Processing**: Extract text, metadata, and page counts from PDF files for code documentation and analysis
- 🌐 **Dual Source Support**: Process both local files and remote URLs (perfect for documentation links)
- 🛡️ **Input Validation**: Comprehensive validation with Augment-specific security considerations
- ⚡ **Fast & Reliable**: Uses `pdftotext` (when available) with `pdf-parse` fallback for maximum reliability
- 🔧 **Configurable**: Customizable security settings and working directories for different project needs
- 📊 **MCP Compliant**: Full Model Context Protocol implementation compatible with Augment's architecture
- 🎯 **Developer-Focused**: Optimized for common development use cases like API docs, specifications, and technical documentation

## Installation

### **Step 1: Install pdftotext (Recommended)**

For better PDF processing, install `pdftotext`:

**Windows:**
```bash
choco install poppler
```

**macOS:**
```bash
brew install poppler
```

**Linux:**
```bash
sudo apt-get install poppler-utils
```

> 📋 **Note**: If `pdftotext` is not available, the server automatically falls back to the JavaScript `pdf-parse` library. See [PDFTOTEXT_SETUP.md](./PDFTOTEXT_SETUP.md) for detailed installation instructions.

### **Step 2: Install MCP Server**

#### Using npm (Public Registry)

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

### Using GitHub Packages

**Configure npm to use GitHub Packages:**
```bash
echo "@paredezadrian:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

**Global Installation:**
```bash
npm install -g @paredezadrian/mcp-pdf-server
```

**Local Installation:**
```bash
npm install @paredezadrian/mcp-pdf-server
```

**Run without installing:**
```bash
npx @paredezadrian/mcp-pdf-server --help
```

**GitHub Package:** https://github.com/paredezadrian/mcp-pdf-server/packages

### From Source

```bash
git clone https://github.com/paredezadrian/mcp-pdf-server.git
cd mcp-pdf-server
npm install
npm run build
npm link
```

## Usage

### **🤖 Augment Code Configuration**

#### **Method 1: Using Augment Settings Panel (Recommended)**

1. **Open Augment Settings**:
   - Press `Cmd/Ctrl + Shift + P`
   - Select "Augment: Open Settings"
   - Or click the hamburger menu in Augment panel → Settings

2. **Add MCP Server**:
   - Scroll to the "MCP Servers" section
   - Click the `+` button to add a new server
   - Fill in the configuration:

| Field | Value |
|-------|-------|
| **Name** | `pdf-processor` |
| **Command** | `npx mcp-pdf-server --working-directory /path/to/your/documents` |

3. **Save and Restart**: Restart VS Code to activate the server

#### **Method 2: Manual settings.json Configuration**

1. **Open Settings**:
   - Press `Cmd/Ctrl + Shift + P`
   - Select "Augment: Edit Settings"
   - Click "Edit in settings.json" under Advanced

2. **Add Configuration**:

```json
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "pdf-processor",
        "command": "npx",
        "args": ["mcp-pdf-server", "--working-directory", "/path/to/your/documents"]
      }
    ]
  }
}
```

3. **Restart VS Code** to apply changes

### **📋 Other MCP Clients**

For other MCP clients (Claude Desktop, etc.), configure as follows:

**If installed globally (npm):**
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

**If installed globally (GitHub Packages):**
```json
{
  "mcpServers": {
    "pdf-server": {
      "command": "@paredezadrian/mcp-pdf-server",
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

**Using npx with GitHub Packages:**
```json
{
  "mcpServers": {
    "pdf-server": {
      "command": "npx",
      "args": ["@paredezadrian/mcp-pdf-server", "--working-directory", "/path/to/pdfs"],
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

## 🎯 **Augment Agent Use Cases**

This MCP server is specifically designed to enhance Augment Agent's capabilities for document-driven development workflows:

### **📚 Documentation Analysis**
- **API Documentation**: Extract text from PDF API docs to understand endpoints and parameters
- **Technical Specifications**: Process requirement documents and technical specs for feature development
- **Code Review Guidelines**: Parse PDF guidelines and coding standards for automated code review

### **🔍 Research & Discovery**
- **Library Documentation**: Extract information from PDF manuals and guides
- **Academic Papers**: Process research papers for algorithm implementation
- **Compliance Documents**: Analyze regulatory PDFs for compliance requirements

### **🤖 Agent Automation Examples**

**Example 1: API Documentation Processing**
```
Agent Prompt: "Read the API documentation PDF in ./docs/api.pdf and create TypeScript interfaces for all the endpoints"

Agent will:
1. Use extract-text to read the PDF
2. Parse the API documentation
3. Generate TypeScript interfaces
4. Create proper documentation comments
```

**Example 2: Requirements Analysis**
```
Agent Prompt: "Analyze the requirements document in ./specs/requirements.pdf and create a project plan with tasks"

Agent will:
1. Extract text from the requirements PDF
2. Identify key features and requirements
3. Break down into development tasks
4. Create implementation plan
```

**Example 3: Code Standards Enforcement**
```
Agent Prompt: "Review my code against the coding standards in ./standards/guidelines.pdf"

Agent will:
1. Extract coding standards from PDF
2. Analyze current codebase
3. Identify violations
4. Suggest improvements
```

### **🔧 Integration with Augment Features**

- **Context Engine**: PDF content becomes part of Augment's context for better code suggestions
- **Agent Memory**: Important PDF information is remembered across sessions
- **Next Edit**: Use PDF content to guide step-by-step code changes
- **Chat Integration**: Ask questions about PDF content while coding

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
