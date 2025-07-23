#!/bin/bash

# UF-Rewriter Deployment Script
# This script helps deploy the UF-Rewriter to Cloudflare Workers

set -e  # Exit on any error

echo "🚀 UF-Rewriter Deployment Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check wrangler
    if ! command -v wrangler &> /dev/null; then
        print_warning "Wrangler CLI not found. Installing globally..."
        npm install -g wrangler
    fi
    
    print_success "All requirements met!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed!"
}

# Set up secrets
setup_secrets() {
    print_status "Setting up secrets..."
    
    # Check if API key is provided as argument or ask for it
    if [ -z "$GEMINI_API_KEY" ]; then
        echo -e "\n${YELLOW}Please enter your Gemini API key:${NC}"
        echo "(You can also set it as environment variable: export GEMINI_API_KEY=your_key)"
        read -s GEMINI_API_KEY
        echo
    fi
    
    if [ -z "$GEMINI_API_KEY" ]; then
        print_error "Gemini API key is required!"
        exit 1
    fi
    
    # Set the secret in Cloudflare Workers
    echo "$GEMINI_API_KEY" | wrangler secret put GEMINI_API_KEY
    print_success "API key configured!"
}

# Deploy to staging
deploy_staging() {
    print_status "Deploying to staging environment..."
    wrangler deploy --env staging
    print_success "Deployed to staging!"
}

# Deploy to production
deploy_production() {
    print_status "Deploying to production environment..."
    wrangler deploy --env production
    print_success "Deployed to production!"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get the worker URL from wrangler
    WORKER_URL=$(wrangler whoami 2>/dev/null | grep -o 'https://.*workers.dev' | head -1)
    
    if [ -z "$WORKER_URL" ]; then
        print_warning "Could not automatically detect worker URL. Please test manually."
        return
    fi
    
    # Simple test
    response=$(curl -s -X POST "$WORKER_URL" \
        -H "Content-Type: application/json" \
        -d '{"query":"test query","prompt":"simple rewrite test"}' \
        --max-time 30 || echo "CURL_FAILED")
    
    if [[ "$response" == *"rewritten"* ]]; then
        print_success "Deployment test passed!"
        echo "Worker URL: $WORKER_URL"
    else
        print_warning "Deployment test failed or timed out. Please check manually."
        echo "Worker URL: $WORKER_URL"
        echo "Response: $response"
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  setup     - Install dependencies and set up secrets"
    echo "  staging   - Deploy to staging environment"
    echo "  prod      - Deploy to production environment"
    echo "  test      - Test the deployment"
    echo "  full      - Run full deployment (setup + staging + test)"
    echo
    echo "Environment Variables:"
    echo "  GEMINI_API_KEY - Your Gemini API key"
    echo
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 staging"
    echo "  GEMINI_API_KEY=your_key $0 full"
}

# Main script logic
main() {
    case "${1:-}" in
        "setup")
            check_requirements
            install_dependencies
            setup_secrets
            ;;
        "staging")
            check_requirements
            deploy_staging
            ;;
        "prod"|"production")
            check_requirements
            deploy_production
            ;;
        "test")
            test_deployment
            ;;
        "full")
            check_requirements
            install_dependencies
            setup_secrets
            deploy_staging
            test_deployment
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            if [ -z "${1:-}" ]; then
                print_error "No command specified."
            else
                print_error "Unknown command: $1"
            fi
            echo
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 