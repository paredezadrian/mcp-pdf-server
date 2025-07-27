# MCP PDF Server Setup for Augment Code

This guide provides step-by-step instructions for integrating the MCP PDF Server with Augment Code's Agent platform.

## 🚀 **Quick Setup**

### **Prerequisites**
- Augment Code extension installed in VS Code
- Node.js 18+ installed
- Active Augment Code subscription

### **Installation**

1. **Install the MCP PDF Server**:
```bash
npm install -g mcp-pdf-server
```

2. **Configure in Augment Settings**:
   - Open VS Code
   - Press `Cmd/Ctrl + Shift + P`
   - Type "Augment: Open Settings"
   - Scroll to "MCP Servers" section
   - Click the `+` button
   - Add configuration:

| Field | Value |
|-------|-------|
| **Name** | `pdf-processor` |
| **Command** | `mcp-pdf-server --working-directory /path/to/your/documents` |

3. **Restart VS Code** to activate the server

## 🔧 **Advanced Configuration**

### **Custom Working Directory**

Set up different working directories for different projects:

```bash
# For documentation projects
mcp-pdf-server --working-directory ./docs

# For specifications
mcp-pdf-server --working-directory ./specs --max-file-size 104857600

# For research papers
mcp-pdf-server --working-directory ./research --timeout 60000
```

### **Environment Variables**

Create a `.env` file in your project root:

```env
MCP_PDF_WORKING_DIR=/path/to/your/documents
MCP_PDF_MAX_FILE_SIZE=52428800
MCP_PDF_TIMEOUT=30000
```

### **Multiple Server Configurations**

You can configure multiple PDF servers for different purposes:

```json
{
  "augment.advanced": {
    "mcpServers": [
      {
        "name": "docs-pdf",
        "command": "mcp-pdf-server",
        "args": ["--working-directory", "./docs", "--max-file-size", "10485760"]
      },
      {
        "name": "specs-pdf", 
        "command": "mcp-pdf-server",
        "args": ["--working-directory", "./specifications", "--max-file-size", "52428800"]
      },
      {
        "name": "research-pdf",
        "command": "mcp-pdf-server", 
        "args": ["--working-directory", "./research", "--timeout", "60000"]
      }
    ]
  }
}
```

## 🎯 **Augment Agent Integration**

### **Basic Usage**

Once configured, you can use natural language with Augment Agent:

```
"Read the API documentation in api-spec.pdf and create TypeScript interfaces"

"Analyze the requirements document and break it down into development tasks"

"Extract the coding standards from guidelines.pdf and apply them to my current file"
```

### **Advanced Agent Prompts**

**Documentation-Driven Development**:
```
"Based on the API documentation in ./docs/api.pdf, implement the user authentication endpoints with proper error handling and TypeScript types"
```

**Requirements Analysis**:
```
"Read the product requirements in ./specs/requirements.pdf, create a project structure, and implement the core features with tests"
```

**Code Review with Standards**:
```
"Using the coding standards from ./standards/guidelines.pdf, review my current codebase and suggest improvements with specific examples"
```

### **Agent Memory Integration**

The PDF content becomes part of Augment's context:

1. **Persistent Context**: PDF information is remembered across sessions
2. **Smart Suggestions**: Code completions consider PDF content
3. **Contextual Chat**: Ask follow-up questions about PDF content

## 🔍 **Troubleshooting**

### **Server Not Starting**

1. **Check Installation**:
```bash
which mcp-pdf-server
mcp-pdf-server --version
```

2. **Verify Configuration**:
   - Open Augment Settings
   - Check MCP Servers section
   - Ensure command path is correct

3. **Check Logs**:
   - Open VS Code Developer Tools (`Help > Toggle Developer Tools`)
   - Look for MCP-related errors in Console

### **Permission Issues**

1. **Working Directory Access**:
```bash
# Ensure directory exists and is readable
ls -la /path/to/your/documents
chmod 755 /path/to/your/documents
```

2. **File Permissions**:
```bash
# Make PDF files readable
chmod 644 /path/to/your/documents/*.pdf
```

### **Performance Issues**

1. **Large Files**: Increase max file size limit
2. **Slow URLs**: Increase timeout setting
3. **Memory Usage**: Restart VS Code periodically

## 📊 **Best Practices**

### **File Organization**

```
project/
├── docs/           # API documentation PDFs
├── specs/          # Requirements and specifications
├── standards/      # Coding guidelines and standards
├── research/       # Academic papers and research
└── examples/       # Example documents
```

### **Security Considerations**

1. **Working Directory**: Keep PDFs in project-specific directories
2. **File Size Limits**: Set appropriate limits for your use case
3. **URL Processing**: Only process trusted URLs
4. **Access Control**: Use proper file permissions

### **Performance Optimization**

1. **Selective Processing**: Only process relevant pages with `startPage`/`endPage`
2. **Caching**: Keep frequently used PDFs in local working directory
3. **File Size**: Optimize PDF files before processing

## 🎉 **Example Workflows**

### **API Development Workflow**

1. **Setup**: Place API documentation PDFs in `./docs/`
2. **Agent Prompt**: "Read the API docs and implement the user service"
3. **Result**: Agent creates TypeScript interfaces, service classes, and tests

### **Feature Development Workflow**

1. **Setup**: Place requirements PDF in `./specs/`
2. **Agent Prompt**: "Implement the feature described in requirements.pdf"
3. **Result**: Agent creates feature implementation with proper structure

### **Code Review Workflow**

1. **Setup**: Place coding standards PDF in `./standards/`
2. **Agent Prompt**: "Review my code against the standards document"
3. **Result**: Agent provides detailed code review with improvements

## 🔗 **Additional Resources**

- [Augment Code Documentation](https://docs.augmentcode.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [PDF Processing Best Practices](./examples/usage-examples.md)
- [Troubleshooting Guide](https://support.augmentcode.com)

## 🆘 **Support**

If you encounter issues:

1. **Check Documentation**: Review this guide and examples
2. **Community Support**: Join [Augment Discord](https://augmentcode.com/discord)
3. **Bug Reports**: Create issues on [GitHub](https://github.com/paredezadrian/mcp-pdf-server)
4. **Professional Support**: Contact [Augment Support](https://support.augmentcode.com)

---

**Ready to supercharge your development workflow with PDF-powered AI assistance!** 🚀
