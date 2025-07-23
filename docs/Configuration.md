# Configuration Guide

This document details the various configuration options for UF-Rewriter, allowing you to customize its behavior, AI models, and API limits.

## Config File (`config.json`)
Customize all settings in one place:

```json
{
  "ai": {
    "model": "gemini-2.0-flash-lite",
    "temperature": 0.5,
    "alternative_models": ["gemini-2.0-flash-exp", "gemini-1.5-flash"]
  },
  "api": {
    "max_query_length": 5000,
    "max_prompt_length": 10000,
    "max_file_prompt_length": 50000
  },
  "worker": {
    "name": "uf-rewriter",
    "staging_name": "uf-rewriter-staging"
  }
}
```

## Available Models
| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| `gemini-2.0-flash-lite` | Fastest | Good | General queries |
| `gemini-2.0-flash-exp` | Fast | Better | Complex rewriting |
| `gemini-1.5-flash` | Medium | High | Detailed analysis |
| `gemini-1.5-pro` | Slower | Highest | Complex reasoning |

## Pre-built Templates
| Template | Use Case | Example |
|----------|----------|---------|
| `scientific` | Research papers, academic databases | PubMed, arXiv, Google Scholar |
| `ecommerce` | Product search, online shopping | Amazon, eBay, retail sites |
| `technical` | Developer docs, programming guides | Documentation, Stack Overflow |
| `medical` | Healthcare information, clinical data | Medical databases, health sites |
| `educational` | Learning content, courses | Educational platforms, tutorials |
| `news` | Current events, news articles | News sites, journalism |
| `legal` | Legal documents, case law | Legal databases, court records |
| `financial` | Investment, market data | Financial platforms, trading |

## Input Limits
- Query: Maximum 5,000 characters (configurable)
- Simple Prompt: Maximum 10,000 characters (configurable)
- Advanced Prompt File: Maximum 50,000 characters (configurable)
- Response timeout: 30 seconds

## Error Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid or missing parameters |
| 405 | Method Not Allowed - Use POST |
| 500 | Internal Server Error - API or processing error |
| 503 | Service Unavailable - API quota exceeded |
