<p align="center">
  <a href="https://www.ulfilter.com/" target="_blank">
    <img src="image/ultrafilter_logo_v1.svg" alt="UltrafilterAI Logo" width="150">
  </a>
</p>


# UF-Rewriter: Intelligent Query Transformation

Unlock precision in search and RAG with AI-powered query rewriting. Simple to deploy, powerful in action.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/UltrafilterAI/uf-rewriter)

## ✨ **Our Philosophy**

At UltrafilterAI, we believe in the power of open-source to drive innovation. UF-Rewriter is our contribution to the community—a simple, powerful tool for query rewriting that we use in our own content engineering workflows. Our goal is to provide a practical, flexible solution that empowers developers to build better search and RAG systems.

We've designed UF-Rewriter with three modes of operation to cater to a variety of use cases:

*   **Simple Mode:** For quick, on-the-fly query rewriting. Just type your prompt and go. It's the perfect starting point for exploring the power of LLM-based query rewriting.

*   **Template Mode:** For workflows that require consistency and repeatability. Define your prompts once, save them as templates, and reuse them as needed. This mode is ideal for production environments where you need to ensure consistent results.

*   **Advanced Mode:** For power users and industry-specific applications. Define your entire prompt in a Markdown file, giving you complete control over the LLM's behavior. This mode is perfect for complex use cases that require fine-tuned control over the rewriting process.

Whether you're a developer building a RAG system, a data scientist optimizing a search engine, or a product manager building a chatbot, UF-Rewriter gives you the tools you need to get the job done.

## 🌍 **Live Demo: Try it Now**

Experience the magic. Replace `https://uf-rewriter-staging.ultrafilterai.workers.dev` with your deployed worker URL.

```bash
curl -X POST https://uf-rewriter-staging.ultrafilterai.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "query": "machine learning tutorial",
    "prompt": "Rewrite for educational content search optimization"
  }'
```

**Response:**
```json
{
  "rewritten": "best machine learning tutorials for beginners"
}
```


## 🚀 **Quick Start: From Zero to Deployed**

Get your AI-powered query rewriter live in minutes. It's easier than brewing coffee.

**Prerequisites:** Node.js 16+, a [Cloudflare account](https://dash.cloudflare.com/sign-up), and a [Gemini API key](https://makersuite.google.com/app/apikey).

```bash
# Clone, install, and auto-configure (it'll ask for your API key and optional custom domain)
git clone https://github.com/UltrafilterAI/uf-rewriter
cd uf-rewriter
npm install
npm run setup

# Deploy to production (your API is now live globally!)
npm run deploy:production
```

**Note:** By default, your worker deploys to a `*.workers.dev` subdomain (e.g., `your-worker.your-username.workers.dev`). This is perfect for most global users. If you need a custom domain, especially for users in China, see the next section.

## 🌏🇨🇳 **Custom Domain Setup (Mandatory for China Users)**

While `.workers.dev` subdomains work for most global users, they are often inaccessible or perform poorly in mainland China. For users in China, a custom domain is **mandatory** for reliable access.

**Steps to configure a custom domain:**

1.  **Acquire a Custom Domain:** You must own a domain (e.g., `yourdomain.com`) and have it added to the **same Cloudflare account** where you are deploying this worker.

2.  **Run the Setup Script:** Execute the setup script. When prompted, enter your desired custom subdomain (e.g., `worker.yourdomain.com`).

    ```bash
    npm run setup
    # Follow the prompts and enter your custom domain when asked.
    ```

3.  **Deploy to Production:** Deploy your worker. Wrangler will automatically configure the necessary DNS records for your custom domain.

    ```bash
    npm run deploy:production
    ```

    Your worker will then be accessible at `https://worker.yourdomain.com` (replace with your actual domain).

4.  **Enable China Network (Optional, for best performance):** For optimal performance and reliability in mainland China, consider enabling Cloudflare's China Network. This requires:
    *   Your Cloudflare account to be on an **Enterprise plan**.
    *   You must have a valid **ICP license** for your domain.
    *   Contact Cloudflare support to enable the **China Network** for your zone.

This will ensure your API is fast and accessible for users in China.

## 🔧 **API Reference**

For detailed API documentation, including all request/response formats, examples, and integration guides, please refer to the [API Reference Documentation](docs/API.md). 

## ⚙️ **Configuration**

Customize UF-Rewriter to fit your needs. For full details on all configuration options, including AI models, API limits, and prompt templates, please refer to the [Configuration Guide](docs/Configuration.md).

## 🛠️ **Development & Advanced Features**

For information on local development, testing, staging vs. production workflows, performance, security, and advanced features like environment-specific secrets, please refer to the [Development Guide](docs/Development.md).

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test locally: `npm run dev && npm test`
4. Deploy to staging for testing: `npm run deploy:staging`
5. Submit a pull request

## 📝 **License**

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [Cloudflare Workers](https://workers.cloudflare.com/) for the serverless platform
- [Google Gemini](https://deepmind.google.com/technologies/gemini/) for the AI capabilities
- Built with ❤️ for the developer community

---

**⭐ If this project helped you, please give it a star on GitHub!**

**🐛 Found a bug or have a feature request? [Open an issue](https://github.com/UltrafilterAI/uf-rewriter/issues)**

**💬 Questions? [Start a discussion](https://github.com/UltrafilterAI/uf-rewriter/discussions)**