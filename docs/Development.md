# Development Guide

This document provides detailed information for developing, testing, and deploying UF-Rewriter, along with insights into its performance, security, and advanced features.

## 🛠️ **Development**

```bash
npm run dev              # Local dev server
npm run deploy:staging   # Deploy to staging
npm run deploy:production # Deploy to production
npm test                 # Run tests
npm run test:advanced    # Test advanced features

# Local testing
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"query":"test","prompt":"simple test"}'
```

## 🔄 **Staging vs Production**

**Smart deployment:** Always test in staging before production.

```bash
# Safe workflow
npm run dev                    # Test locally
npm run deploy:staging         # Deploy to staging
curl staging-url...            # Test staging
npm run deploy:production      # Deploy to production

# ❌ Never do this
npm run deploy:production      # Skip staging = risky!
```

**Benefits:** Zero downtime, safe rollbacks, team collaboration

## 📈 **Performance**

**200-500ms globally** • **~1ms cold start** • **Unlimited concurrency** • **99.9% uptime** • **200+ edge locations**

## 🔒 **Security**

**Encrypted secrets** • **CORS enabled** • **Input validation** • **Rate limiting** • **DDoS protection**

## 🚀 **Advanced Features**

```bash
# Custom domain (add to wrangler.toml)
routes = [{ pattern = "api.yourdomain.com/rewriter", zone_name = "yourdomain.com" }]

# Environment-specific secrets
echo "STAGING_KEY" | npx wrangler secret put GEMINI_API_KEY --env staging
echo "PROD_KEY" | npx wrangler secret put GEMINI_API_KEY --env production

# Analytics: Cloudflare Dashboard → Workers & Pages
```

```