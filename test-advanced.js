// Advanced test script for UF-Rewriter API - Tests all new features
// Run with: node test-advanced.js

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8787'; // For local testing
// const API_URL = 'https://your-worker.workers.dev'; // For deployed version

console.log('🚀 UF-Rewriter Advanced Feature Test Suite');
console.log('==============================================\n');

// Helper function to read prompt file
function readPromptFile(filename) {
  try {
    return fs.readFileSync(path.join('prompts', filename), 'utf8');
  } catch (error) {
    console.log(`❌ Could not read prompt file: ${filename}`);
    return null;
  }
}

// Test cases for all modes
const testCases = [
  // Simple mode tests
  {
    name: 'Simple Mode - Basic Query',
    mode: 'simple',
    data: {
      query: 'machine learning tutorial',
      prompt: 'Rewrite for educational content search'
    }
  },
  
  // Template mode tests
  {
    name: 'Template Mode - Scientific',
    mode: 'template',
    data: {
      query: 'covid vaccine side effects',
      prompt_template: 'scientific'
    }
  },
  {
    name: 'Template Mode - E-commerce',
    mode: 'template',
    data: {
      query: 'gaming laptop under 1000',
      prompt_template: 'ecommerce'
    }
  },
  {
    name: 'Template Mode - Technical',
    mode: 'template',
    data: {
      query: 'react hooks not working',
      prompt_template: 'technical'
    }
  },
  {
    name: 'Template Mode - Medical',
    mode: 'template',
    data: {
      query: 'heart disease symptoms',
      prompt_template: 'medical'
    }
  },
  
  // Advanced mode tests (with prompt files)
  {
    name: 'Advanced Mode - Scientific Research',
    mode: 'advanced',
    data: {
      query: 'alzheimer disease treatment',
      prompt_file: readPromptFile('scientific-research.md')
    }
  },
  {
    name: 'Advanced Mode - E-commerce Optimization',
    mode: 'advanced',
    data: {
      query: 'wireless headphones for running',
      prompt_file: readPromptFile('ecommerce-optimization.md')
    }
  },
  {
    name: 'Advanced Mode - Technical Documentation',
    mode: 'advanced',
    data: {
      query: 'python async programming',
      prompt_file: readPromptFile('technical-documentation.md')
    }
  },
  
  // Model selection tests
  {
    name: 'Model Selection - Flash Lite',
    mode: 'simple',
    data: {
      query: 'best coffee shops',
      prompt: 'Optimize for local business search',
      model: 'gemini-2.0-flash-lite'
    }
  },
  {
    name: 'Model Selection - Flash Experimental',
    mode: 'simple',
    data: {
      query: 'climate change research',
      prompt: 'Rewrite for academic research',
      model: 'gemini-2.0-flash-exp'
    }
  },
  
  // Temperature tests
  {
    name: 'Temperature Test - Conservative (0.1)',
    mode: 'simple',
    data: {
      query: 'healthy recipes',
      prompt: 'Optimize for nutrition and health content',
      temperature: 0.1
    }
  },
  {
    name: 'Temperature Test - Creative (0.9)',
    mode: 'simple',
    data: {
      query: 'weekend activities',
      prompt: 'Suggest creative leisure and entertainment options',
      temperature: 0.9
    }
  }
];

// Error test cases
const errorTests = [
  {
    name: 'Invalid Template',
    data: {
      query: 'test query',
      prompt_template: 'invalid_template'
    }
  },
  {
    name: 'No Prompt Provided',
    data: {
      query: 'test query'
    }
  },
  {
    name: 'Multiple Prompt Types',
    data: {
      query: 'test query',
      prompt: 'simple prompt',
      prompt_template: 'scientific',
      prompt_file: 'should conflict'
    }
  }
];

async function testAPI() {
  console.log('🧪 Testing API Features...\n');

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`🔧 Mode: ${testCase.mode}`);
    console.log(`📥 Query: "${testCase.data.query}"`);
    
    // Show prompt info based on mode
    if (testCase.data.prompt) {
      console.log(`📋 Prompt: "${testCase.data.prompt}"`);
    } else if (testCase.data.prompt_template) {
      console.log(`📋 Template: ${testCase.data.prompt_template}`);
    } else if (testCase.data.prompt_file) {
      console.log(`📋 Prompt File: ${testCase.data.prompt_file ? 'Loaded' : 'Failed to load'}`);
    }
    
    if (testCase.data.model) {
      console.log(`🤖 Model: ${testCase.data.model}`);
    }
    
    if (testCase.data.temperature !== undefined) {
      console.log(`🌡️ Temperature: ${testCase.data.temperature}`);
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      if (!response.ok) {
        const error = await response.text();
        console.log(`❌ Error (${response.status}): ${error}`);
      } else {
        const result = await response.json();
        console.log(`✅ Rewritten: "${result.rewritten}"`);
        if (result.model_used) {
          console.log(`🤖 Model Used: ${result.model_used}`);
        }
        if (result.mode) {
          console.log(`🔧 Mode Used: ${result.mode}`);
        }
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

async function testErrorHandling() {
  console.log('🔍 Testing Error Handling...\n');

  for (const test of errorTests) {
    console.log(`🔍 Error Test: ${test.name}`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data)
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

async function testTemplatesList() {
  console.log('📋 Testing Available Templates...\n');
  
  // Test getting available templates (this would be a new endpoint)
  const templates = ['scientific', 'ecommerce', 'educational', 'technical', 'medical', 'news', 'legal', 'financial'];
  
  console.log('Available Templates:');
  templates.forEach(template => {
    console.log(`  • ${template}`);
  });
  console.log('---\n');
}

// Run all tests
async function runAllTests() {
  try {
    await testTemplatesList();
    await testAPI();
    await testErrorHandling();
    console.log('✅ All advanced tests completed!');
    console.log('\n💡 Advanced Features Summary:');
    console.log('   • Simple Mode: Direct prompt input');
    console.log('   • Template Mode: Pre-defined prompt templates');
    console.log('   • Advanced Mode: Markdown prompt files');
    console.log('   • Model Selection: Choose different Gemini models');
    console.log('   • Temperature Control: Adjust creativity level');
  } catch (error) {
    console.error('❌ Test runner error:', error);
  }
}

// Auto-run if this script is executed directly
if (require.main === module) {
  runAllTests();
} 