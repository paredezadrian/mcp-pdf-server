# GitHub Packages Publishing Guide

This guide explains how to use the MCP PDF Server published on GitHub Packages.

## 📦 **What is GitHub Packages?**

GitHub Packages is GitHub's package registry that allows you to publish and consume packages directly from your GitHub repository. It's an alternative to the public npm registry.

## 🔗 **Package Information**

- **Package Name**: `@paredezadrian/mcp-pdf-server`
- **Registry**: `https://npm.pkg.github.com`
- **Repository**: https://github.com/paredezadrian/mcp-pdf-server
- **Packages Page**: https://github.com/paredezadrian/mcp-pdf-server/packages

## 🚀 **Installation**

### **1. Configure npm for GitHub Packages**

First, configure npm to use GitHub Packages for the `@paredezadrian` scope:

```bash
# Add to your global .npmrc
echo "@paredezadrian:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Or create a local `.npmrc` file in your project:

```bash
# Create .npmrc in your project directory
echo "@paredezadrian:registry=https://npm.pkg.github.com" > .npmrc
```

### **2. Install the Package**

**Global Installation:**
```bash
npm install -g @paredezadrian/mcp-pdf-server
```

**Local Installation:**
```bash
npm install @paredezadrian/mcp-pdf-server
```

**Using npx (no installation):**
```bash
npx @paredezadrian/mcp-pdf-server --help
```

## 🔧 **Usage**

### **Command Line**

After global installation:
```bash
@paredezadrian/mcp-pdf-server --working-directory ./pdfs
```

Or with npx:
```bash
npx @paredezadrian/mcp-pdf-server --working-directory ./pdfs
```

### **MCP Client Configuration**

**Claude Desktop Configuration:**
```json
{
  "mcpServers": {
    "pdf-processor": {
      "command": "@paredezadrian/mcp-pdf-server",
      "args": ["--working-directory", "/path/to/pdfs"],
      "name": "PDF Processor (GitHub Packages)"
    }
  }
}
```

**Using npx in MCP:**
```json
{
  "mcpServers": {
    "pdf-processor": {
      "command": "npx",
      "args": ["@paredezadrian/mcp-pdf-server", "--working-directory", "/path/to/pdfs"],
      "name": "PDF Processor (GitHub Packages)"
    }
  }
}
```

## 🔄 **Publishing Process**

### **Automated Publishing**

The package is automatically published to GitHub Packages using GitHub Actions:

1. Go to the repository's Actions tab
2. Select "Publish to GitHub Packages" workflow
3. Click "Run workflow"
4. Choose version bump type (patch/minor/major)
5. The workflow will automatically:
   - Run tests and quality checks
   - Bump the version
   - Create a git tag
   - Publish to GitHub Packages

### **Manual Publishing**

If you need to publish manually:

```bash
# Configure npm for GitHub Packages
npm config set @paredezadrian:registry https://npm.pkg.github.com

# Login to GitHub Packages (requires GitHub token)
npm login --scope=@paredezadrian --registry=https://npm.pkg.github.com

# Build and publish
npm run build
npm publish
```

## 🔐 **Authentication**

### **For Installation (Public Package)**

No authentication required for installing public packages from GitHub Packages.

### **For Publishing**

Publishing requires authentication with a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a token with `write:packages` permission
3. Use the token for authentication

## 🆚 **GitHub Packages vs npm Registry**

| Feature | GitHub Packages | npm Registry |
|---------|----------------|--------------|
| **Hosting** | GitHub | npmjs.com |
| **Scope** | `@paredezadrian/mcp-pdf-server` | `mcp-pdf-server` |
| **Authentication** | GitHub token | npm token |
| **Integration** | Tight GitHub integration | Standalone |
| **Visibility** | Linked to repository | Separate listing |

## 🎯 **Benefits of GitHub Packages**

- **Repository Integration**: Package versions are linked to git tags
- **Security**: Uses GitHub's security infrastructure
- **Access Control**: Can be private or public
- **Consistency**: Same authentication as your repository
- **Automation**: Easy CI/CD integration with GitHub Actions

## 🔍 **Troubleshooting**

### **Installation Issues**

**Error: "Package not found"**
```bash
# Make sure registry is configured
npm config get @paredezadrian:registry
# Should return: https://npm.pkg.github.com
```

**Error: "Authentication required"**
```bash
# Check if you're trying to install a private package
# Public packages don't require authentication
```

### **Publishing Issues**

**Error: "Authentication failed"**
- Ensure your GitHub token has `write:packages` permission
- Check that you're logged in: `npm whoami --registry=https://npm.pkg.github.com`

**Error: "Package already exists"**
- The workflow checks for existing versions automatically
- Manually check: `npm view @paredezadrian/mcp-pdf-server versions --json`

## 📊 **Package Statistics**

You can view package statistics and download counts at:
https://github.com/paredezadrian/mcp-pdf-server/packages

## 🔄 **Version Management**

- **GitHub Packages versions** are tagged with `github-v1.0.x`
- **npm registry versions** are tagged with `v1.0.x`
- Both packages contain the same code, just published to different registries

## 📝 **Example Project Setup**

Create a new project using the GitHub Packages version:

```bash
# Create project directory
mkdir my-pdf-project
cd my-pdf-project

# Initialize npm project
npm init -y

# Configure for GitHub Packages
echo "@paredezadrian:registry=https://npm.pkg.github.com" > .npmrc

# Install the package
npm install @paredezadrian/mcp-pdf-server

# Use in your project
npx @paredezadrian/mcp-pdf-server --help
```

Your MCP PDF Server is now available on both npm and GitHub Packages! 🎉
