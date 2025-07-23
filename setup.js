#!/usr/bin/env node

// Quick setup script for UF-Rewriter
// This script automatically configures the API key and custom domain for you

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load configuration
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Get API key from environment variable or prompt user
function getAPIKey() {
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey) {
    console.log('✅ Using API key from environment variable');
    return envKey;
  }
  
  console.log('⚠️  No GEMINI_API_KEY environment variable found');
  console.log('📋 You have two options:');
  console.log('   1. Set environment variable: export GEMINI_API_KEY=your_key');
  console.log('   2. Get a free API key from: https://makersuite.google.com/app/apikey');
  console.log('');
  return null; // Return null instead of exiting
}

console.log('🚀 Setting up UF-Rewriter...\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Check if wrangler is installed
function checkWrangler() {
  try {
    execSync('wrangler --version', { stdio: 'pipe' });
    console.log('✅ Wrangler CLI found\n');
  } catch (error) {
    console.log('📦 Installing Wrangler CLI globally...');
    runCommand('npm install -g wrangler', 'Installing Wrangler CLI');
  }
}

// Set up the API key
function setupAPIKey() {
  console.log('🔑 Setting up Gemini API key...');
  
  const apiKey = getAPIKey();
  
  if (apiKey) {
    try {
      // Use echo to pipe the API key to wrangler secret put
      execSync(`echo "${apiKey}" | npx wrangler secret put ${config.security.api_key_name}`, { stdio: 'inherit' });
      console.log('✅ API key configured successfully\n');
    } catch (error) {
      console.error('❌ Failed to set API key:', error.message);
      console.log(`💡 You can set it manually with: npx wrangler secret put ${config.security.api_key_name}`);
      console.log('💡 Or set environment variable: export GEMINI_API_KEY=your_key');
      process.exit(1);
    }
  } else {
    console.log('✅ Assuming API key is already set via `wrangler secret put` or will be set manually.\n');
  }
}

// Update wrangler.toml with config values based on config.json
function updateWranglerConfig() {
  console.log('⚙️ Updating wrangler configuration...');
  try {
    const currentConfig = JSON.parse(fs.readFileSync('config.json', 'utf8')); // Re-read config to get latest custom_domain
    const customDomain = currentConfig.environments.production.custom_domain;
    let routesConfig = '';

    if (customDomain) {
      const zoneName = customDomain.split('.').slice(-2).join('.'); // Extract root domain
      routesConfig = `\nroutes = [\n    { pattern = "${customDomain}", custom_domain = true, zone_name = "${zoneName}" }\n]`;
    }

    const wranglerConfigContent = `name = "${currentConfig.worker.name}"\nmain = "src/index.ts"\ncompatibility_date = "2024-01-15"\n\n[env.production]\nname = "${currentConfig.worker.production_name}"${routesConfig}\n\n[env.staging]\nname = "${currentConfig.worker.staging_name}"\n\n# Secrets configuration (set with: npx wrangler secret put ${currentConfig.security.api_key_name})\n# No secrets should be stored in this file - use Cloudflare Workers secrets instead\n`;
    
    fs.writeFileSync('wrangler.toml', wranglerConfigContent);
    console.log('✅ Wrangler configuration updated\n');
  } catch (error) {
    console.error('❌ Failed to update wrangler config:', error.message);
    process.exit(1);
  }
}

// Main setup function
async function main() {
  try {
    console.log('🔍 Checking requirements...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    console.log(`📦 Node.js version: ${nodeVersion}`);
    
    // Check if dependencies are installed
    if (!fs.existsSync('node_modules')) {
      runCommand('npm install', 'Installing dependencies');
    } else {
      console.log('✅ Dependencies already installed\n');
    }
    
    // Check and install Wrangler
    checkWrangler();
    
    // Set up API key
    setupAPIKey();

    // Prompt for custom domain and update config.json
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise(resolve => {
      rl.question('Enter your custom domain for production (e.g., worker.mydomain.com), or press Enter to skip: ', (domain) => {
        if (domain) {
          config.environments.production.custom_domain = domain.trim(); // Trim whitespace
          fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
          console.log(`✅ Custom domain set to: ${domain.trim()}\n`);
        } else {
          config.environments.production.custom_domain = ""; // Ensure it's empty if skipped
          fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
          console.log('✅ Skipping custom domain setup.\n');
        }
        rl.close();
        resolve();
      });
    })

    // Update wrangler.toml based on config.json (now with potentially updated custom_domain)
    updateWranglerConfig();
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Configuration Summary:');
    console.log(`  • Project: ${config.project.name}`);
    console.log(`  • Model: ${config.ai.model}`);
    console.log(`  • Worker Name: ${config.worker.name}`);
    console.log(`  • Max Query Length: ${config.api.max_query_length} chars`);
    console.log(`  • Advanced Mode: ${config.prompts.advanced_mode.enabled ? 'Enabled' : 'Disabled'}`);
    
    console.log('\n📋 Next steps:');
    console.log('  1. Test locally: npm run dev');
    console.log('  2. Test advanced features: node test-advanced.js');
    console.log('  3. Deploy to staging: npm run deploy:staging');
    console.log('  4. Deploy to production: npm run deploy:production');
    
    console.log('\n🛠️ Available Modes:');
    console.log('  • Simple: Direct prompt input');
    console.log('  • Template: Pre-defined templates (scientific, ecommerce, etc.)');
    console.log('  • Advanced: Markdown prompt files');
    
    console.log('\n📋 Available Templates:');
    Object.keys(config.prompts.default_templates).forEach(template => {
      console.log(`    • ${template}`);
    });
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
