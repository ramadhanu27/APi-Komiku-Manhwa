/**
 * Simple API Testing Script
 * Run: node test-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${API_BASE}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Test cases
const tests = [
  {
    name: 'Health Check',
    path: '/api/health'
  },
  {
    name: 'Get Stats',
    path: '/api/stats'
  },
  {
    name: 'Get All Manga (page 1)',
    path: '/api/manga?page=1&limit=5'
  },
  {
    name: 'Search Manga',
    path: '/api/search?q=academy&limit=3'
  },
  {
    name: 'Get Genres',
    path: '/api/genres'
  },
  {
    name: 'Get Manga by Slug',
    path: '/api/manga/99-wooden-stick'
  },
  {
    name: 'Get Manga Details',
    path: '/api/manga/99-wooden-stick/details'
  },
  {
    name: 'Get Chapters',
    path: '/api/chapters/99-wooden-stick?limit=5'
  },
  {
    name: 'Get Specific Chapter',
    path: '/api/chapters/99-wooden-stick/1'
  },
  {
    name: 'Filter by Genre',
    path: '/api/manga?genre=Action&limit=3'
  },
  {
    name: 'Latest Updates',
    path: '/api/latest-updates?limit=5'
  }
];

// Run tests
async function runTests() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║       Komiku API Testing                  ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      console.log(`\n📝 Testing: ${test.name}`);
      console.log(`   Endpoint: ${test.path}`);
      
      const result = await makeRequest(test.path);
      
      if (result.status === 200 && result.data.success) {
        console.log(`   ✅ PASSED (Status: ${result.status})`);
        
        // Show sample data
        if (result.data.data) {
          if (Array.isArray(result.data.data)) {
            console.log(`   📊 Results: ${result.data.data.length} items`);
            if (result.data.total) {
              console.log(`   📈 Total available: ${result.data.total}`);
            }
          } else if (typeof result.data.data === 'object') {
            const keys = Object.keys(result.data.data);
            console.log(`   📋 Fields: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`);
          }
        }
        
        passed++;
      } else {
        console.log(`   ❌ FAILED (Status: ${result.status})`);
        console.log(`   Error: ${JSON.stringify(result.data)}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failed++;
    }
  }
  
  // Summary
  console.log('\n\n╔═══════════════════════════════════════════╗');
  console.log('║           Test Summary                    ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${tests.length}`);
  console.log(`\n${passed === tests.length ? '🎉 All tests passed!' : '⚠️  Some tests failed'}\n`);
}

// Check if server is running
console.log('Checking if API server is running...\n');
makeRequest('/api/health')
  .then(() => {
    console.log('✅ Server is running!\n');
    runTests();
  })
  .catch(() => {
    console.log('❌ Server is not running!');
    console.log('\nPlease start the server first:');
    console.log('  npm run api\n');
    process.exit(1);
  });
