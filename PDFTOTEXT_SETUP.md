# Installing pdftotext for Better PDF Processing

The MCP PDF Server now uses `pdftotext` as the primary PDF processing method with `pdf-parse` as a fallback. `pdftotext` is generally more reliable and handles complex PDFs better.

## 🚀 **Quick Installation**

### **Windows**

#### **Option 1: Using Chocolatey (Recommended)**
```bash
# Install Chocolatey if you don't have it
# Run as Administrator in PowerShell:
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install poppler (includes pdftotext)
choco install poppler
```

#### **Option 2: Manual Installation**
1. Download poppler for Windows from: https://github.com/oschwartz10612/poppler-windows/releases
2. Extract to `C:\poppler` (or your preferred location)
3. Add `C:\poppler\Library\bin` to your PATH environment variable
4. Restart your command prompt/VS Code

#### **Option 3: Using Scoop**
```bash
# Install Scoop if you don't have it
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install poppler
scoop install poppler
```

### **macOS**

#### **Using Homebrew (Recommended)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install poppler
brew install poppler
```

#### **Using MacPorts**
```bash
sudo port install poppler
```

### **Linux**

#### **Ubuntu/Debian**
```bash
sudo apt-get update
sudo apt-get install poppler-utils
```

#### **CentOS/RHEL/Fedora**
```bash
# CentOS/RHEL
sudo yum install poppler-utils

# Fedora
sudo dnf install poppler-utils
```

#### **Arch Linux**
```bash
sudo pacman -S poppler
```

## ✅ **Verify Installation**

After installation, verify that pdftotext is working:

```bash
# Check if pdftotext is available
pdftotext -v

# Should output something like:
# pdftotext version 23.01.0
```

## 🔧 **How It Works**

### **Automatic Detection**
The MCP PDF Server automatically detects if `pdftotext` is available:

- ✅ **If available**: Uses `pdftotext` for text extraction (more reliable)
- ⚠️ **If not available**: Falls back to `pdf-parse` library (JavaScript-based)

### **Benefits of pdftotext**
- **Better Text Extraction**: Handles complex layouts and fonts better
- **Faster Processing**: Native C++ implementation is faster than JavaScript
- **More Reliable**: Better handling of corrupted or complex PDFs
- **Page Range Support**: Efficient extraction of specific page ranges

### **Fallback Behavior**
If `pdftotext` fails for any reason, the server automatically falls back to `pdf-parse`:

```
✅ pdftotext is available - using as primary PDF processor
⚠️  pdftotext failed, falling back to pdf-parse: [error details]
```

## 🧪 **Testing Your Installation**

### **Test with MCP Server**
```bash
# Start the server
npx mcp-pdf-server --working-directory "C:\Users\mod\Documents\Documents"

# You should see:
# ✅ pdftotext is available - using as primary PDF processor
# MCP PDF Server started successfully
```

### **Test with Augment Agent**
Once configured in Augment Code, try:
```
"Extract text from test.pdf and tell me what it contains"
```

## 🔍 **Troubleshooting**

### **Windows Issues**

#### **"pdftotext is not recognized"**
- Ensure poppler is installed and in your PATH
- Restart VS Code after installation
- Check PATH: `echo $env:PATH` (PowerShell) or `echo %PATH%` (CMD)

#### **Permission Issues**
- Run installation as Administrator
- Ensure antivirus isn't blocking the installation

### **macOS Issues**

#### **"command not found: pdftotext"**
- Ensure Homebrew is installed: `brew --version`
- Reinstall poppler: `brew reinstall poppler`
- Check if it's in PATH: `which pdftotext`

### **Linux Issues**

#### **Package not found**
- Update package lists: `sudo apt-get update`
- Try alternative package names: `poppler-utils` vs `poppler`

### **General Issues**

#### **Server still uses pdf-parse**
- Check console output when starting the server
- Verify pdftotext works: `pdftotext -v`
- Restart the MCP server after installing pdftotext

## 📊 **Performance Comparison**

| Method | Speed | Reliability | Complex PDFs | Page Ranges |
|--------|-------|-------------|--------------|-------------|
| **pdftotext** | ⚡ Fast | 🟢 Excellent | 🟢 Excellent | 🟢 Efficient |
| **pdf-parse** | 🐌 Slower | 🟡 Good | 🟡 Limited | 🟡 Memory intensive |

## 🎯 **Recommendations**

1. **Install pdftotext** for the best experience
2. **Use Windows Chocolatey** for easy installation and updates
3. **Restart VS Code** after installation
4. **Test with your PDFs** to ensure everything works
5. **Keep both methods** - the fallback ensures compatibility

## 🆘 **Still Having Issues?**

1. **Check the console output** when starting the MCP server
2. **Try manual pdftotext command**: `pdftotext test.pdf -`
3. **Verify file permissions** on your PDF files
4. **Create an issue** on GitHub with your error details

---

**With pdftotext installed, your MCP PDF Server will be much more reliable and faster!** 🚀
