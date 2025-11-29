const http = require('http');
const { spawn } = require('child_process');

console.log('Starting server...');
const serverProcess = spawn('node', ['index.js'], {
  stdio: 'pipe',
  env: { ...process.env, PORT: '4001' } // Use a different port to avoid conflicts
});

let serverReady = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('[Server]:', output.trim());
  if (output.includes('Ready to accept connections')) {
    serverReady = true;
    runTests();
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error('[Server Error]:', data.toString());
});

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4001${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('\nRunning tests...');
  
  try {
    // Test 1: Search Route (Public)
    console.log('Testing /search...');
    const searchRes = await makeRequest('/search');
    console.log(`Status: ${searchRes.statusCode}`);
    if (searchRes.statusCode === 200) {
      console.log('SUCCESS: /search is accessible');
    } else {
      console.log('FAILURE: /search returned', searchRes.statusCode);
    }

    // Test 2: Admin Dashboard (Should redirect if not logged in)
    console.log('\nTesting /admin/dashboard (Unauthenticated)...');
    const dashboardRes = await makeRequest('/admin/dashboard');
    console.log(`Status: ${dashboardRes.statusCode}`);
    if (dashboardRes.statusCode === 302 && dashboardRes.headers.location.includes('/users/login')) {
      console.log('SUCCESS: /admin/dashboard redirects to login correctly');
    } else {
      console.log('FAILURE: /admin/dashboard returned', dashboardRes.statusCode, 'Location:', dashboardRes.headers.location);
    }

    // Test 3: Create Post (Should redirect if not logged in)
    console.log('\nTesting /posts/new (Unauthenticated)...');
    const createRes = await makeRequest('/posts/new');
    console.log(`Status: ${createRes.statusCode}`);
    if (createRes.statusCode === 302 && createRes.headers.location.includes('/users/login')) {
      console.log('SUCCESS: /posts/new redirects to login correctly');
    } else {
      console.log('FAILURE: /posts/new returned', createRes.statusCode, 'Location:', createRes.headers.location);
    }

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    console.log('\nStopping server...');
    serverProcess.kill();
    process.exit(0);
  }
}

// Timeout if server doesn't start
setTimeout(() => {
  if (!serverReady) {
    console.error('Timeout waiting for server to start');
    serverProcess.kill();
    process.exit(1);
  }
}, 10000);
