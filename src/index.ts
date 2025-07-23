import { GoogleGenAI } from '@google/genai';
import { config } from './config.js';

// Types for our API
interface RewriteRequest {
  query: string;
  prompt?: string;
  prompt_file?: string; // Markdown content for advanced mode
  prompt_template?: string; // Pre-defined template name
  model?: string; // Allow model override
  temperature?: number; // Allow temperature override
}

interface RewriteResponse {
  rewritten: string;
  model_used?: string;
  mode?: 'simple' | 'advanced' | 'template';
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Environment variables interface
interface Env {
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return createErrorResponse('Method not allowed. Use POST.', 405);
    }

    try {
      // Parse request body
      const body: RewriteRequest = await request.json();
      
      // Validate required fields
      if (!body.query || typeof body.query !== 'string') {
        return createErrorResponse('Missing or invalid "query" field', 400);
      }
      
      // Validate prompt fields - at least one must be provided
      const hasPrompt = body.prompt && typeof body.prompt === 'string';
      const hasPromptFile = body.prompt_file && typeof body.prompt_file === 'string';
      const hasPromptTemplate = body.prompt_template && typeof body.prompt_template === 'string';
      
      if (!hasPrompt && !hasPromptFile && !hasPromptTemplate) {
        return createErrorResponse('Must provide one of: "prompt", "prompt_file", or "prompt_template"', 400);
      }

      // Check if query is too long (prevent abuse)
      if (body.query.length > config.api.max_query_length) {
        return createErrorResponse(`Query too long. Maximum ${config.api.max_query_length} characters.`, 400);
      }

      // Validate prompt lengths based on type
      if (body.prompt && body.prompt.length > config.api.max_prompt_length) {
        return createErrorResponse(`Prompt too long. Maximum ${config.api.max_prompt_length} characters.`, 400);
      }
      
      if (body.prompt_file && body.prompt_file.length > config.api.max_file_prompt_length) {
        return createErrorResponse(`Prompt file too long. Maximum ${config.api.max_file_prompt_length} characters.`, 400);
      }

      // Determine which prompt to use and the mode
      let finalPrompt: string;
      let mode: 'simple' | 'advanced' | 'template';
      
      if (body.prompt_file) {
        // Advanced mode: Use markdown file content
        mode = 'advanced';
        finalPrompt = body.prompt_file.trim();
      } else if (body.prompt_template) {
        // Template mode: Use predefined template
        mode = 'template';
        const template = (config.prompts.default_templates as any)[body.prompt_template];
        if (!template) {
          return createErrorResponse(`Unknown prompt template: ${body.prompt_template}. Available: ${Object.keys(config.prompts.default_templates).join(', ')}`, 400);
        }
        finalPrompt = template;
      } else {
        // Simple mode: Use provided prompt
        mode = 'simple';
        finalPrompt = body.prompt!.trim();
      }

      // Construct the full prompt for the LLM
      const fullPrompt = `${finalPrompt}

Original Query: "${body.query}"

Please provide only the rewritten query without any additional explanation or formatting:`;

      // Initialize Gemini AI - use environment variable
      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return createErrorResponse('API configuration error: Missing API key', 500);
      }
      const genAI = new GoogleGenAI({ apiKey });
      
      // Use model from request, config, or default
      const modelToUse = body.model || config.ai.model;
      const temperatureToUse = body.temperature ?? config.ai.temperature;
      
      const response = await genAI.models.generateContent({
        model: modelToUse,
        contents: fullPrompt,
        config: {
          temperature: temperatureToUse,
          maxOutputTokens: config.ai.max_tokens,
        }
      });

      // Get the rewritten query
      const rewrittenQuery = response.text || 'No rewrite available';

      // Clean up the response (remove quotes, extra whitespace, etc.)
      const cleanedQuery = rewrittenQuery
        .replace(/^["']|["']$/g, '') // Remove surrounding quotes
        .trim();

      // Return successful response with metadata
      return createSuccessResponse({ 
        rewritten: cleanedQuery,
        model_used: modelToUse,
        mode: mode
      });

    } catch (error: any) {
      console.error('Error processing request:', error);
      
      // Handle specific error types
      if (error.name === 'SyntaxError') {
        return createErrorResponse('Invalid JSON in request body', 400);
      }
      
      if (error.message?.includes('API key')) {
        return createErrorResponse('API configuration error', 500, 'Invalid or missing API key');
      }
      
      if (error.message?.includes('quota')) {
        return createErrorResponse('Service temporarily unavailable', 503, 'API quota exceeded');
      }

      // Generic error response
      return createErrorResponse(
        'Internal server error', 
        500, 
        error.message
      );
    }
  },
};

// Helper function to create error responses
function createErrorResponse(message: string, status: number = 500, details?: string): Response {
  const errorBody: ErrorResponse = { error: message };
  if (details) {
    errorBody.details = details;
  }

  return new Response(JSON.stringify(errorBody), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// Helper function to create success responses
function createSuccessResponse(data: RewriteResponse): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
} 