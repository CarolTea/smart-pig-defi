# Smart Pig DeFi - Automated Versioning & Release System

## 🚀 Overview

This document describes the complete automated versioning, changelog generation, and release management system implemented for Smart Pig DeFi. The system uses semantic versioning, conventional commits, and automated CI/CD pipelines to manage releases across all components.

## 📋 System Components

### 🔧 Core Tools

- **Semantic Release**: Automated version management and releases
- **Conventional Commits**: Standardized commit message format
- **Commitizen**: Interactive commit message creation
- **Commitlint**: Commit message validation
- **Husky**: Git hooks for quality control
- **Conventional Changelog**: Automated changelog generation

### 📦 Project Structure

```
smart-pig-defi/
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # NestJS API server
├── docs/              # Docusaurus documentation
├── k8s/               # Kubernetes manifests
├── scripts/           # Automation scripts
├── .github/workflows/ # CI/CD pipelines
└── package.json       # Root monorepo config
```

## 🎯 Features

### ✅ Automated Versioning

- **Semantic versioning** (major.minor.patch)
- **Automatic version bumping** based on commit types
- **Cross-package version synchronization**
- **Git tag creation** with release notes

### 📝 Changelog Generation

- **Automated changelog** generation from commits
- **Conventional commit categorization**
- **Release notes** with emojis and sections
- **Breaking changes** highlighting

### 🚀 Release Management

- **GitHub releases** with assets
- **Docker image tagging** with versions
- **Kubernetes deployment** automation
- **Documentation deployment** to GitHub Pages

### 🔒 Quality Control

- **Commit message validation**
- **Pre-commit hooks** for linting and testing
- **Pre-push hooks** for comprehensive validation
- **Branch protection** for releases

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies (includes all versioning tools)
npm install

# Install project dependencies
make install-all

# Install git hooks
make install-hooks
```

### 2. Initial Configuration

```bash
# Generate initial changelog
make changelog-first

# Check current versions
make version-check

# Synchronize versions if needed
make version-sync
```

### 3. Configure GitHub Repository

#### Required Secrets

Add these secrets to your GitHub repository:

```
GITHUB_TOKEN         # GitHub personal access token (required for releases)
```

#### Optional Secrets (AWS Deployment)

Only needed if you want to deploy to AWS/Kubernetes:

```
AWS_ACCESS_KEY_ID    # AWS access key for K8s deployment
AWS_SECRET_ACCESS_KEY # AWS secret key
AWS_REGION           # AWS region (e.g., us-west-2)
EKS_CLUSTER_NAME     # EKS cluster name
```

#### Optional Secrets (NPM Publishing)

```
NPM_TOKEN            # NPM registry token (only if publishing to NPM)
```

#### Repository Variables

To enable AWS deployment, add this repository variable:

```
ENABLE_AWS_DEPLOYMENT=true  # Set to 'true' to enable AWS/K8s deployment
```

**Note**: If `ENABLE_AWS_DEPLOYMENT` is not set or is `false`, the CI/CD pipeline will:

- ✅ Run all tests and quality checks
- ✅ Create semantic releases with changelogs
- ✅ Build and publish Docker images to GitHub Container Registry
- ✅ Deploy documentation to GitHub Pages
- ⏭️ Skip AWS/Kubernetes deployment steps

#### Branch Protection

Enable branch protection rules for `main` branch:

- Require status checks
- Require up-to-date branches
- Require review from code owners
- Restrict pushes to admins only

## 📝 Usage Guide

### Making Commits

#### Option 1: Interactive Commitizen

```bash
# Use commitizen for interactive commit creation
make commit
# or
npm run commit
```

#### Option 2: Manual Conventional Commits

```bash
feat(frontend): add new user authentication component
fix(backend): resolve database connection timeout
docs(readme): update installation instructions
perf(api): optimize user query performance
breaking(auth): change authentication API structure

BREAKING CHANGE: Authentication API now requires bearer token
```

### Commit Types

- `feat`: New features (minor version bump)
- `fix`: Bug fixes (patch version bump)
- `perf`: Performance improvements (patch version bump)
- `docs`: Documentation changes (patch version bump)
- `style`: Code style changes (patch version bump)
- `refactor`: Code refactoring (patch version bump)
- `test`: Test additions/changes (patch version bump)
- `build`: Build system changes (patch version bump)
- `ci`: CI/CD changes (patch version bump)
- `chore`: Maintenance tasks (no version bump)
- `revert`: Revert previous commits (patch version bump)

### Creating Releases

#### Automatic Release (Recommended)

```bash
# 1. Make sure you're on main branch
git checkout main
git pull origin main

# 2. Run pre-release checks
make pre-release

# 3. Preview release (dry run)
make release-dry

# 4. Create actual release
make release
```

#### Manual Version Management

```bash
# Check current versions
make version-check

# Generate changelog manually
make changelog

# Synchronize versions across packages
make version-sync
```

### Development Workflow

#### Daily Development

```bash
# Prepare code for commit
make ready-to-commit

# Create conventional commit
make commit

# Prepare for push
make ready-to-push

# Push to repository
git push origin feature-branch
```

#### Quality Checks

```bash
# Run all quality gates
make quality-gate

# Run CI/CD simulation
make ci

# Validate commit messages
make validate-commit
```

## 🚢 Deployment Process

### Automatic Deployment Pipeline

1. **Code Push** to `main` branch
2. **Quality Checks**:
   - Frontend tests and linting
   - Backend tests and linting
   - Documentation build
   - Security scanning
3. **Semantic Release**:
   - Analyze commits
   - Determine version bump
   - Generate changelog
   - Create GitHub release
   - Update package.json files
4. **Docker Build**:
   - Build multi-arch images
   - Tag with semantic version
   - Push to GitHub Container Registry
   - Security scan images
5. **Deployment**:
   - Deploy to Kubernetes
   - Update image tags
   - Deploy documentation to GitHub Pages
   - Create deployment notifications

### Manual Deployment

```bash
# Build and deploy everything
make deploy

# Deploy to Kubernetes
make k8s-deploy

# Deploy documentation
make docs-deploy
```

## 🐳 Docker Integration

### Building Images with Versions

```bash
# Build all Docker images
docker-compose build

# Build with specific version
docker build --build-arg VERSION=1.2.3 -t smart-pig-frontend:1.2.3 ./frontend
```

### Running with Docker

```bash
# Development environment
make docker-dev

# Production environment
make docker-run

# View logs
make docker-logs
```

## 📚 Documentation

### Local Development

```bash
# Start docs development server
make docs-dev

# Build documentation
make docs-build

# Serve built docs
make docs-serve
```

### Deployment

Documentation is automatically deployed to GitHub Pages on every release.

### Enabling AWS/Kubernetes Deployment (Optional)

If you want to deploy to AWS/Kubernetes later, follow these steps:

1. **Set up AWS Account and EKS Cluster**:

   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # Configure AWS CLI
   aws configure

   # Create EKS cluster (example)
   eksctl create cluster --name smart-pig-cluster --region us-west-2
   ```

2. **Add GitHub Secrets**:
   - Go to your repository Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
     - `AWS_REGION`: Your AWS region (e.g., `us-west-2`)
     - `EKS_CLUSTER_NAME`: Your EKS cluster name

3. **Enable AWS Deployment**:
   - Go to Settings > Secrets and variables > Actions > Variables tab
   - Add repository variable: `ENABLE_AWS_DEPLOYMENT` = `true`

4. **Test Deployment**:
   ```bash
   # Trigger a new release to test AWS deployment
   make release
   ```

Once enabled, every release will automatically deploy to your Kubernetes cluster!

## 🔍 Monitoring & Troubleshooting

### Version Checking

```bash
# Check all versions
make version-check

# List all release tags
make tag-list

# Show latest tag
make tag-latest
```

### Debugging Releases

```bash
# Run semantic release dry run
make release-dry

# Check git status
git status

# Validate branch
make validate-branch

# Check commit history
git log --oneline --graph
```

### Common Issues

#### Release Not Triggered

- Check commit message format
- Ensure commits are on `main` branch
- Verify no `[skip ci]` in commit messages
- Check GitHub Actions status

#### Version Sync Issues

```bash
# Force version synchronization
node scripts/sync-versions.js <version>

# Validate package.json files
make version-check
```

#### Git Hooks Not Working

```bash
# Reinstall hooks
make install-hooks

# Check hook permissions
ls -la .husky/

# Test commit validation
make validate-commit
```

## 🎨 Customization

### Modifying Release Rules

Edit `.releaserc.json` to customize:

- Commit analysis rules
- Version bump logic
- Changelog generation
- Release assets

### Adding New Scopes

Edit `.czrc` to add new commit scopes:

```json
{
  \"scopes\": [
    \"frontend\",
    \"backend\",
    \"docs\",
    \"new-scope\"
  ]
}
```

### Custom Release Branches

Modify `.releaserc.json` branches configuration:

```json
{
  \"branches\": [
    \"main\",
    {
      \"name\": \"develop\",
      \"prerelease\": \"beta\"
    }
  ]
}
```

## 📞 Support

For issues with the versioning system:

1. Check this documentation
2. Review GitHub Actions logs
3. Validate commit message format
4. Ensure all dependencies are installed
5. Contact the development team

## 🔗 Related Commands

### Essential Makefile Commands

```bash
make help                 # Show all available commands
make setup               # Complete project setup
make quality-gate        # Run all quality checks
make pre-release         # Pre-release validation
make full-release        # Complete release workflow
make ready-to-commit     # Prepare code for commit
make ready-to-push       # Prepare for push
```

---

**🎉 Congratulations!** You now have a fully automated versioning and release system for Smart Pig DeFi. The system will handle version management, changelog generation, and deployments automatically based on your conventional commits.
