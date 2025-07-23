// Configuration for UF-Rewriter
export const config = {
  project: {
    name: "uf-rewriter",
    description: "LLM-powered query rewriter microservice"
  },
  worker: {
    name: "uf-rewriter",
    staging_name: "uf-rewriter-staging",
    production_name: "uf-rewriter"
  },
  ai: {
    provider: "google",
    model: "gemini-2.0-flash-lite",
    alternative_models: [
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash",
      "gemini-1.5-pro"
    ],
    temperature: 0.5,
    max_tokens: 1024
  },
  api: {
    max_query_length: 5000,
    max_prompt_length: 10000,
    max_file_prompt_length: 50000,
    timeout_seconds: 30
  },
  security: {
    api_key_name: "GEMINI_API_KEY",
    cors_enabled: true,
    allowed_origins: ["*"]
  },
  environments: {
    local: {
      port: 8787,
      host: "localhost"
    },
    staging: {
      custom_domain: "",
      routes: []
    },
    production: {
      custom_domain: "",
      routes: []
    }
  },
  prompts: {
    default_templates: {
      scientific: "Rewrite for academic and scientific document retrieval. Use precise terminology, include relevant synonyms, and optimize for research database search.",
      ecommerce: "Optimize for product search. Include relevant categories, price ranges, user demographics, and commercial intent keywords.",
      educational: "Rewrite for educational content discovery. Focus on learning objectives, skill levels, and instructional formats.",
      technical: "Optimize for technical documentation search. Include specific technologies, programming languages, and technical concepts.",
      medical: "Rewrite for medical and healthcare information retrieval. Use clinical terminology, medical synonyms, and healthcare-specific language.",
      news: "Rewrite for news and current events search. Include temporal keywords, location-specific terms, and news-relevant context.",
      legal: "Optimize for legal document retrieval. Use legal terminology, case law references, and jurisdiction-specific language.",
      financial: "Rewrite for financial and investment content search. Include market terms, financial instruments, and economic indicators."
    },
    advanced_mode: {
      enabled: true,
      support_markdown: true,
      support_file_upload: false,
      max_file_size_kb: 100
    }
  }
} as const;

export type Config = typeof config; 