#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const platform = process.platform;

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'mistral';

console.log('\n=====================================');
console.log('  Ollama Setup for Interview Platform');
console.log('=====================================\n');

// Helper to make HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    const options = {
      method,
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });

    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('Timeout')));
    req.end();
  });
}

// Check if Ollama is running
async function checkOllama() {
  console.log('🔍 Checking if Ollama is running...');
  try {
    const { status } = await makeRequest(`${OLLAMA_URL}/api/tags`);
    if (status === 200) {
      console.log('✅ Ollama is running on localhost:11434\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Ollama is not running!\n');
  }
  return false;
}

// Check if model is installed
async function checkModel() {
  console.log(`🔍 Checking for ${MODEL} model...`);
  try {
    const { status, data } = await makeRequest(`${OLLAMA_URL}/api/tags`);
    if (status === 200) {
      try {
        const json = JSON.parse(data);
        const hasModel = json.models?.some(m => m.name.includes(MODEL));
        if (hasModel) {
          console.log(`✅ ${MODEL} model is installed\n`);
          return true;
        }
      } catch (e) {
        // Continue to pull
      }
    }
  } catch (error) {
    // Continue to pull
  }
  return false;
}

// Pull model using ollama CLI
function pullModel() {
  return new Promise((resolve) => {
    console.log(`📥 Downloading ${MODEL} model (this may take 5-10 minutes, ~5GB)...\n`);
    
    const cmd = `ollama pull ${MODEL}`;
    const child = exec(cmd);
    
    child.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });
    
    child.stderr?.on('data', (data) => {
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${MODEL} model downloaded successfully\n`);
        resolve(true);
      } else {
        console.log(`\n❌ Failed to download ${MODEL} model\n`);
        resolve(false);
      }
    });
  });
}

// Main setup flow
async function main() {
  try {
    // Step 1: Check Ollama
    const ollamaRunning = await checkOllama();
    if (!ollamaRunning) {
      console.log('Instructions to start Ollama:');
      if (platform === 'win32') {
        console.log('  1. Search for "Ollama" in Windows Start menu');
        console.log('  2. Click to open it (runs in background)');
        console.log('  3. Wait 10 seconds for it to start');
        console.log('  4. Run this script again\n');
      } else if (platform === 'darwin') {
        console.log('  1. Open Terminal');
        console.log('  2. Run: ollama serve');
        console.log('  3. In another terminal, run this script again\n');
      } else {
        console.log('  1. Open a terminal');
        console.log('  2. Run: ollama serve');
        console.log('  3. In another terminal, run this script again\n');
      }
      process.exit(1);
    }

    // Step 2: Check Model
    const hasModel = await checkModel();
    if (!hasModel) {
      const success = await pullModel();
      if (!success) {
        console.log('⚠️  Failed to pull model. Please try manually:');
        console.log(`   ollama pull ${MODEL}\n`);
        process.exit(1);
      }
    }

    // Success
    console.log('=====================================');
    console.log('  ✅ Setup Complete!');
    console.log('=====================================\n');
    console.log('Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Open http://localhost:3000');
    console.log('  3. Start the interview\n');
    console.log('Questions will now be generated using local Ollama!\n');

  } catch (error) {
    console.error('❌ Setup error:', error.message);
    process.exit(1);
  }
}

main();
