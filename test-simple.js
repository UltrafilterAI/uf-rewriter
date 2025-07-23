// Simple test script for the UF-Rewriter API
// Run with: node test-simple.js

const API_URL = 'http://localhost:8787'; // For local testing
// const API_URL = 'https://your-worker.workers.dev'; // For deployed version

const testCases = [
  {
    name: 'Scientific Query Enhancement',
    query: 'covid vaccine side effects',
    prompt: 'Rewrite for medical research database search. Use precise medical terminology and include relevant synonyms.'
  },
  {
    name: 'E-commerce Search Optimization',
    query: 'cheap laptop for students',
    prompt: 'Optimize for product search. Include relevant product categories, price ranges, and user demographics.'
  },
  {
    name: 'Intent Clarification',
    query: 'python tutorial',
    prompt: 'Disambiguate user intent. Specify if this is about programming, the snake, or Monty Python.'
  },
  {
    name: 'Basic Query Enhancement',
    query: 'best pizza places',
    prompt: 'Rewrite this query for restaurant search optimization'
  }
];

async function testAPI() {
  console.log('🧪 Testing UF-Rewriter API...\n');

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`📥 Original Query: "${testCase.query}"`);
    console.log(`📋 Prompt: "${testCase.prompt}"`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: testCase.query,
          prompt: testCase.prompt
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.log(`❌ Error (${response.status}): ${error}`);
      } else {
        const result = await response.json();
        console.log(`✅ Rewritten: "${result.rewritten}"`);
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

// Error handling test
async function testErrorHandling() {
  console.log('🔍 Testing Error Handling...\n');

  const errorTests = [
    {
      name: 'Missing Query',
      body: { prompt: 'Test prompt' }
    },
    {
      name: 'Missing Prompt',
      body: { query: 'Test query' }
    },
    {
      name: 'Empty Body',
      body: {}
    }
  ];

  for (const test of errorTests) {
    console.log(`🔍 Error Test: ${test.name}`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.body)
      });

      const result = await response.text();
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${result}`);
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 UF-Rewriter API Test Suite');
  console.log('=============================\n');
  
  try {
    await testAPI();
    await testErrorHandling();
    console.log('✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test runner error:', error);
  }
}

// Auto-run if this script is executed directly
if (require.main === module) {
  runAllTests();
} 