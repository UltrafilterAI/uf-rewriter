# API Reference

This document provides detailed information on how to interact with the UF-Rewriter API, including endpoints, request/response formats, and various integration examples.

## Endpoint
```
POST https://your-worker.workers.dev/
```

## Request Format

### Simple Mode
```json
{
  "query": "Original search query",
  "prompt": "Instructions for how to rewrite the query"
}
```

### Template Mode
```json
{
  "query": "covid vaccine side effects",
  "prompt_template": "scientific"
}
```

### Advanced Mode (Markdown Prompts)
```json
{
  "query": "machine learning tutorial",
  "prompt_file": "# Detailed instructions...\n\nTransform queries for educational content discovery..."
}
```

### With Model & Temperature Control
```json
{
  "query": "best restaurants",
  "prompt": "Optimize for local business search", 
  "model": "gemini-2.0-flash-exp",
  "temperature": 0.7
}
```

## Response Format
```json
{
  "rewritten": "Enhanced query based on your prompt",
  "model_used": "gemini-2.0-flash-lite",
  "mode": "simple"
}
```

## Error Response
```json
{
  "error": "Error description",
  "details": "Additional error information"
}
```

## Examples

```bash
# Scientific search optimization
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"covid vaccine side effects","prompt":"Use medical terminology with synonyms"}'
# → "COVID-19 vaccine adverse events OR post-vaccination complications"

# E-commerce optimization  
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"cheap laptop for students","prompt":"Include price ranges and categories"}'
# → "Student laptops under $700: Chromebooks, budget Windows laptops"

# Intent disambiguation
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"python tutorial","prompt":"Clarify programming vs other meanings"}'
# → "Python programming tutorial"
```

## Integration Examples

### Simple Mode - JavaScript/TypeScript
```javascript
async function rewriteQuery(query, prompt) {
  const response = await fetch('https://your-worker.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, prompt })
  });
  
  const result = await response.json();
  return result.rewritten;
}

// Usage
const enhanced = await rewriteQuery(
  "best pizza places",
  "Optimize for local restaurant search with location and ratings"
);
```

### Template Mode - JavaScript/TypeScript
```javascript
async function rewriteWithTemplate(query, template) {
  const response = await fetch('https://your-worker.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query, 
      prompt_template: template 
    })
  });
  
  const result = await response.json();
  return result;
}

// Usage
const scientific = await rewriteWithTemplate(
  "covid vaccine effectiveness",
  "scientific"
);
```

### Advanced Mode - JavaScript/TypeScript
```javascript
const fs = require('fs'); // Node.js only

async function rewriteAdvanced(query, promptFilePath, model = null) {
  // Read markdown file content
  const promptContent = fs.readFileSync(promptFilePath, 'utf8');
  
  const response = await fetch('https://your-worker.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query,
      prompt_file: promptContent, // Send file content, not path
      model: model,
      temperature: 0.3
    })
  });
  
  return await response.json();
}

// Usage with local markdown files
const result = await rewriteAdvanced(
  "wireless headphones",
  "prompts/ecommerce-optimization.md",
  "gemini-2.0-flash-exp"
);

// Browser version (file upload)
async function rewriteAdvancedBrowser(query, fileInput) {
  const file = fileInput.files[0];
  const promptContent = await file.text();
  
  const response = await fetch('https://your-worker.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query,
      prompt_file: promptContent
    })
  });
  
  return await response.json();
}
```

### Python
```python
import requests

def rewrite_query(query, prompt):
    """Simple mode"""
    url = "https://your-worker.workers.dev"
    payload = {"query": query, "prompt": prompt}
    
    response = requests.post(url, json=payload)
    return response.json()["rewritten"]

def rewrite_advanced(query, prompt_file_path, model=None):
    """Advanced mode with markdown file"""
    url = "https://your-worker.workers.dev"
    
    # Read markdown file content
    with open(prompt_file_path, 'r', encoding='utf-8') as f:
        prompt_content = f.read()
    
    payload = {
        "query": query,
        "prompt_file": prompt_content,  # Send file content, not path
        "model": model,
        "temperature": 0.3
    }
    
    response = requests.post(url, json=payload)
    return response.json()

# Simple usage
enhanced = rewrite_query(
    "machine learning course",
    "Rewrite for online education platform search"
)

# Advanced usage with markdown file
result = rewrite_advanced(
    "covid vaccine effectiveness",
    "prompts/scientific-research.md",
    "gemini-2.0-flash-exp"
)
```

### cURL
```bash
# Simple mode
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"your query","prompt":"your instructions"}'

# Advanced mode with markdown file (using jq)
jq -n \
  --arg query "covid vaccine effectiveness" \
  --rawfile prompt_file "prompts/scientific-research.md" \
  '{query: $query, prompt_file: $prompt_file}' | \
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d @-

# Template mode
curl -X POST https://your-worker.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"alzheimer treatment","prompt_template":"scientific"}'
```