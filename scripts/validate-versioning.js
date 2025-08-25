#!/usr/bin/env node

/**
 * Smart Pig DeFi - Versioning System Validation Script
 * 
 * This script validates the complete automated versioning and release system.
 * It checks all configurations, dependencies, and workflows.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  reset: '\\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkPackageField(packagePath, field, description) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg[field]) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - Error reading package.json`, 'red');
    return false;
  }
}

function runCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    log(`✅ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkVersionSync() {
  try {
    const rootPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'frontend', 'package.json'), 'utf8'));
    const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'backend', 'package.json'), 'utf8'));
    const docsPkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'package.json'), 'utf8'));
    
    const versions = {
      root: rootPkg.version,
      frontend: frontendPkg.version,
      backend: backendPkg.version,
      docs: docsPkg.version
    };
    
    const allSame = Object.values(versions).every(v => v === versions.root);
    
    if (allSame) {
      log(`✅ All packages synchronized at version ${versions.root}`, 'green');
      return true;
    } else {
      log(`❌ Version mismatch detected:`, 'red');
      Object.entries(versions).forEach(([pkg, version]) => {
        log(`   ${pkg}: ${version}`, 'yellow');
      });
      return false;
    }
  } catch (error) {
    log(`❌ Error checking version synchronization: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('\n🚀 Smart Pig DeFi - Versioning System Validation', 'cyan');
  log('=' * 60, 'cyan');
  
  let allChecks = [];
  
  // Configuration Files
  log('\n📋 Configuration Files:', 'blue');
  allChecks.push(checkFile('.releaserc.json', 'Semantic Release Configuration'));
  allChecks.push(checkFile('.czrc', 'Commitizen Configuration'));
  allChecks.push(checkFile('CHANGELOG.md', 'Changelog File'));
  allChecks.push(checkFile('scripts/sync-versions.js', 'Version Sync Script'));
  
  // Git Hooks
  log('\n🪝 Git Hooks:', 'blue');
  allChecks.push(checkFile('.husky/commit-msg', 'Commit Message Hook'));
  allChecks.push(checkFile('.husky/pre-commit', 'Pre-commit Hook'));
  allChecks.push(checkFile('.husky/pre-push', 'Pre-push Hook'));
  
  // Package.json Configurations
  log('\n📦 Package Configurations:', 'blue');
  allChecks.push(checkPackageField('package.json', 'scripts', 'Root Package Scripts'));
  allChecks.push(checkPackageField('package.json', 'devDependencies', 'Root Dev Dependencies'));
  allChecks.push(checkPackageField('frontend/package.json', 'scripts', 'Frontend Package Scripts'));
  allChecks.push(checkPackageField('backend/package.json', 'scripts', 'Backend Package Scripts'));
  allChecks.push(checkPackageField('docs/package.json', 'scripts', 'Docs Package Scripts'));
  
  // Docker Files
  log('\n🐳 Docker Configuration:', 'blue');
  allChecks.push(checkFile('frontend/Dockerfile', 'Frontend Production Dockerfile'));
  allChecks.push(checkFile('frontend/Dockerfile.dev', 'Frontend Development Dockerfile'));
  allChecks.push(checkFile('backend/Dockerfile', 'Backend Production Dockerfile'));
  allChecks.push(checkFile('backend/Dockerfile.dev', 'Backend Development Dockerfile'));
  allChecks.push(checkFile('docs/Dockerfile', 'Docs Production Dockerfile'));
  allChecks.push(checkFile('docs/Dockerfile.dev', 'Docs Development Dockerfile'));
  allChecks.push(checkFile('docker-compose.yml', 'Production Docker Compose'));
  allChecks.push(checkFile('docker-compose.dev.yml', 'Development Docker Compose'));
  
  // Kubernetes Manifests
  log('\n☸️  Kubernetes Configuration:', 'blue');
  allChecks.push(checkFile('k8s/frontend-deployment.yaml', 'Frontend K8s Deployment'));
  allChecks.push(checkFile('k8s/backend-deployment.yaml', 'Backend K8s Deployment'));
  allChecks.push(checkFile('k8s/docs-deployment.yaml', 'Docs K8s Deployment'));
  allChecks.push(checkFile('k8s/ingress.yaml', 'K8s Ingress Configuration'));
  
  // GitHub Actions
  log('\n🤖 CI/CD Pipeline:', 'blue');
  allChecks.push(checkFile('.github/workflows/ci-cd.yml', 'GitHub Actions Workflow'));
  
  // Documentation
  log('\n📚 Documentation:', 'blue');
  allChecks.push(checkFile('docs/VERSIONING.md', 'Versioning Documentation'));
  allChecks.push(checkFile('docs/nginx.conf', 'Docs Nginx Configuration'));
  
  // Version Synchronization
  log('\n🔄 Version Synchronization:', 'blue');
  allChecks.push(checkVersionSync());
  
  // Command Availability
  log('\n⚡ Command Availability:', 'blue');
  allChecks.push(runCommand('which node', 'Node.js Available'));
  allChecks.push(runCommand('which npm', 'NPM Available'));
  allChecks.push(runCommand('which git', 'Git Available'));
  allChecks.push(runCommand('which docker', 'Docker Available'));
  
  // Dependency Checks
  log('\n📦 Dependency Validation:', 'blue');
  allChecks.push(runCommand('npm list semantic-release --depth=0', 'Semantic Release Installed'));
  allChecks.push(runCommand('npm list commitizen --depth=0', 'Commitizen Installed'));
  allChecks.push(runCommand('npm list @commitlint/cli --depth=0', 'Commitlint Installed'));
  allChecks.push(runCommand('npm list husky --depth=0', 'Husky Installed'));
  
  // Results Summary
  log('\n📊 Validation Results:', 'magenta');
  log('=' * 40, 'magenta');
  
  const passed = allChecks.filter(Boolean).length;
  const total = allChecks.length;
  const percentage = Math.round((passed / total) * 100);
  
  log(`Total Checks: ${total}`, 'cyan');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${total - passed}`, 'red');
  log(`Success Rate: ${percentage}%`, percentage === 100 ? 'green' : 'yellow');
  
  if (percentage === 100) {
    log('\n🎉 All validations passed! Your versioning system is ready!', 'green');
    log('\n🚀 Next steps:', 'blue');
    log('1. Run \"make commit\" to create your first conventional commit', 'cyan');
    log('2. Run \"make release-dry\" to preview the release process', 'cyan');
    log('3. Run \"make release\" to create your first automated release', 'cyan');
  } else {
    log('\n⚠️  Some validations failed. Please review the errors above.', 'yellow');
    log('\n🔧 Common fixes:', 'blue');
    log('1. Run \"npm install\" to install missing dependencies', 'cyan');
    log('2. Run \"make install-hooks\" to install git hooks', 'cyan');
    log('3. Check file permissions with \"ls -la\"', 'cyan');
  }
  
  log('\n📖 For detailed documentation, see docs/VERSIONING.md', 'blue');
  log('\n' + '=' * 60, 'cyan');
  
  process.exit(percentage === 100 ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { main, checkFile, checkPackageField, runCommand, checkVersionSync };