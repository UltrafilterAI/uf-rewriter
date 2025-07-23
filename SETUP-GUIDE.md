# 🚀 Complete Setup Guide for UF-Rewriter

## 📋 **Prerequisites**

1. **Node.js 16+** - [Download here](https://nodejs.org/)
2. **Cloudflare Account** - [Free signup](https://dash.cloudflare.com/sign-up)
3. **Google Gemini API Key** - [Get free key](https://makersuite.google.com/app/apikey)

## 🔑 **Step 1: Get Your Gemini API Key**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key (starts with `AIzaSy...`)

## ⚙️ **Step 2: Set Environment Variable**

### On macOS/Linux:
```bash
export GEMINI_API_KEY=your_actual_api_key_here
```

### On Windows:
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
```

### Permanent Setup:
Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
```bash
echo 'export GEMINI_API_KEY=your_actual_api_key_here' >> ~/.zshrc
source ~/.zshrc
```

## 🏗️ **Step 3: Install and Setup**

```bash
# Clone the repository
git clone https://github.com/your-username/uf-rewriter
cd uf-rewriter

# Install dependencies
npm install

# Run automated setup
npm run setup
```

## 🧪 **Step 4: Test Everything Works**

```bash
# Test locally
npm run dev

# In another terminal, run tests
npm test
npm run test:advanced
```

## 🚀 **Step 5: Deploy**

```bash
# Authenticate with Cloudflare (if not done by setup)
npx wrangler login

# Deploy to staging first
npm run deploy:staging

# Test staging deployment
curl https://your-worker-staging.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"query":"test","prompt":"simple test"}'

# If staging works, deploy to production
npm run deploy:production
```

## 🛠️ **Customization**

### Change Worker Name
Edit `config.json`:
```json
{
  "worker": {
    "name": "my-custom-rewriter",
    "staging_name": "my-custom-rewriter-staging"
  }
}
```

### Change AI Model
Edit `config.json`:
```json
{
  "ai": {
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.3
  }
}
```

### Add Custom Prompt Template
Edit `src/config.ts`:
```typescript
default_templates: {
  // Add your custom template
  custom: "Your custom prompt template instructions here..."
}
```

## ⚠️ **Troubleshooting**

### API Key Issues
```bash
# Check if environment variable is set
echo $GEMINI_API_KEY

# If empty, set it again
export GEMINI_API_KEY=your_key
```

### Wrangler Authentication
```bash
# Login to Cloudflare
npx wrangler login

# Check your account
npx wrangler whoami
```

### Worker Name Conflicts
```bash
# List existing workers
npx wrangler list

# Delete old worker if needed
npx wrangler delete worker-name
```

## 🔒 **Security Best Practices**

1. **Never commit API keys to git**
2. **Use environment variables for secrets**
3. **Test in staging before production**
4. **Use different API keys for staging/production**

## 📞 **Support**

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/your-username/uf-rewriter/issues)
- 💬 [Discussions](https://github.com/your-username/uf-rewriter/discussions) 