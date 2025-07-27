# GitHub to npm Automation Setup

This guide explains how to set up automatic publishing from GitHub to npm.

## 🎯 What This Does

- **Automatic npm publishing** when you create version tags
- **Manual version bumping** with GitHub Actions
- **Quality checks** before publishing (tests, linting, building)
- **Consistent workflow** for releases

## 🔧 Setup Steps

### 1. Create npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click your profile → "Access Tokens"
3. Click "Generate New Token" → "Automation"
4. Copy the token (starts with `npm_...`)

### 2. Add npm Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/paredezadrian/mcp-pdf-server
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click "Add secret"

### 3. Test the Setup

The automation is now ready! Here's how to use it:

## 🚀 How to Use

### Method 1: Manual Workflow (Recommended)

1. Make your changes and push to GitHub
2. Go to "Actions" tab in your GitHub repository
3. Click "Auto Version and Publish" workflow
4. Click "Run workflow"
5. Choose version bump type:
   - **patch**: Bug fixes (1.0.3 → 1.0.4)
   - **minor**: New features (1.0.3 → 1.1.0)
   - **major**: Breaking changes (1.0.3 → 2.0.0)
6. Click "Run workflow"

### Method 2: Tag-based Publishing

1. Create and push a version tag:
   ```bash
   npm version patch  # or minor/major
   git push --follow-tags
   ```
2. The "Publish to npm" workflow will run automatically

## 📋 What Happens During Automation

1. **✅ Quality Checks**:
   - Install dependencies
   - Run tests (`npm test`)
   - Run linting (`npm run lint`)
   - Build project (`npm run build`)

2. **✅ Version Management**:
   - Bump version in package.json
   - Create git tag
   - Push changes to GitHub

3. **✅ Publishing**:
   - Publish to npm registry
   - Update npm package page

## 🔍 Monitoring

- **GitHub Actions**: Check the "Actions" tab for workflow status
- **npm**: Check https://www.npmjs.com/package/mcp-pdf-server for updates
- **Notifications**: GitHub will email you if workflows fail

## 🛠️ Workflow Files

- `.github/workflows/publish.yml`: Publishes when tags are pushed
- `.github/workflows/auto-version.yml`: Manual version bumping and publishing

## 🚨 Important Notes

### Security
- **Never commit npm tokens** to your repository
- **Use GitHub Secrets** for sensitive information
- **Tokens are encrypted** and only accessible to workflows

### Version Strategy
- **patch**: Bug fixes, documentation updates
- **minor**: New features, backward-compatible changes
- **major**: Breaking changes, API changes

### Troubleshooting

**If publishing fails:**
1. Check GitHub Actions logs
2. Verify npm token is valid
3. Ensure package name is available
4. Check if version already exists

**If tests fail:**
- Fix the failing tests before publishing
- Workflows will not publish if tests fail

## 🎉 Benefits

- **✅ Consistent releases**: Same process every time
- **✅ Quality assurance**: Tests run before publishing
- **✅ Time saving**: No manual npm publish commands
- **✅ Version tracking**: Git tags match npm versions
- **✅ Rollback capability**: Easy to revert if needed

## 📝 Example Workflow

1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **Run workflow** from GitHub Actions
4. **Choose version type** (patch/minor/major)
5. **Automatic publishing** to npm
6. **Users get updates** via `npm update`

Your package will now automatically stay in sync between GitHub and npm! 🚀
