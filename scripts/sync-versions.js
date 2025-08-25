#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Synchronizes version across all package.json files in the monorepo
 * Usage: node sync-versions.js <version>
 */

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Version argument is required');
  console.log('Usage: node sync-versions.js <version>');
  process.exit(1);
}

// Validate semantic version format
const semverRegex = /^\d+\.\d+\.\d+(-[\w.-]+)?(\+[\w.-]+)?$/;
if (!semverRegex.test(newVersion)) {
  console.error(`❌ Error: Invalid semantic version format: ${newVersion}`);
  console.log('Expected format: x.y.z or x.y.z-prerelease or x.y.z+build');
  process.exit(1);
}

const packagePaths = [
  path.join(__dirname, '..', 'package.json'),
  path.join(__dirname, '..', 'frontend', 'package.json'),
  path.join(__dirname, '..', 'backend', 'package.json'),
  path.join(__dirname, '..', 'docs', 'package.json')
];

console.log(`🔄 Synchronizing version to ${newVersion}...`);

let updatedCount = 0;
let errorCount = 0;

packagePaths.forEach((packagePath) => {
  try {
    if (!fs.existsSync(packagePath)) {
      console.warn(`⚠️  Warning: Package file not found: ${packagePath}`);
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const oldVersion = packageJson.version;
    
    packageJson.version = newVersion;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    const relativePath = path.relative(process.cwd(), packagePath);
    console.log(`✅ Updated ${relativePath}: ${oldVersion} → ${newVersion}`);
    updatedCount++;
    
  } catch (error) {
    const relativePath = path.relative(process.cwd(), packagePath);
    console.error(`❌ Error updating ${relativePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n📊 Version Sync Summary:');
console.log(`   ✅ Successfully updated: ${updatedCount} files`);
console.log(`   ❌ Errors: ${errorCount} files`);
console.log(`   🎯 Target version: ${newVersion}`);

if (errorCount > 0) {
  console.log('\n⚠️  Some files could not be updated. Please check the errors above.');
  process.exit(1);
} else {
  console.log('\n🎉 All package versions synchronized successfully!');
}

// Additional tasks after version sync
console.log('\n🔧 Running additional version sync tasks...');

try {
  // Update version in docker-compose files if they reference version
  const dockerComposePaths = [
    path.join(__dirname, '..', 'docker-compose.yml'),
    path.join(__dirname, '..', 'docker-compose.dev.yml')
  ];

  dockerComposePaths.forEach((composePath) => {
    if (fs.existsSync(composePath)) {
      let content = fs.readFileSync(composePath, 'utf8');
      
      // Replace version tags in image names (if they exist)
      const versionRegex = /image:\s*(.+):v?\d+\.\d+\.\d+/g;
      const updatedContent = content.replace(versionRegex, (match, imageName) => {
        return `image: ${imageName}:v${newVersion}`;
      });
      
      if (content !== updatedContent) {
        fs.writeFileSync(composePath, updatedContent);
        const relativePath = path.relative(process.cwd(), composePath);
        console.log(`✅ Updated image versions in ${relativePath}`);
      }
    }
  });

  // Update version in Kubernetes manifests if they reference version
  const k8sPath = path.join(__dirname, '..', 'k8s');
  if (fs.existsSync(k8sPath)) {
    const k8sFiles = fs.readdirSync(k8sPath).filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
    
    k8sFiles.forEach((file) => {
      const filePath = path.join(k8sPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace version tags in image names
      const versionRegex = /image:\s*(.+):v?\d+\.\d+\.\d+/g;
      const updatedContent = content.replace(versionRegex, (match, imageName) => {
        return `image: ${imageName}:v${newVersion}`;
      });
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ Updated image versions in k8s/${file}`);
      }
    });
  }

  console.log('✅ Additional version sync tasks completed');

} catch (error) {
  console.warn('⚠️  Warning: Some additional version sync tasks failed:', error.message);
}

console.log('\n🎯 Version synchronization completed successfully!');