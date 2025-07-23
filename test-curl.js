const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
const API_URL = "https://uf-rewriter.ultrafilterai.workers.dev";
const QUERY = "alzheimer disease treatment";
const PROMPT_FILE = "prompts/scientific-research.md";
// ---------------------

console.log(`🚀 Testing Advanced Mode with ${PROMPT_FILE}`);

// 1. Read the prompt file content
const promptContent = fs.readFileSync(path.resolve(PROMPT_FILE), 'utf8');

// 2. Create the JSON payload
const payload = {
  query: QUERY,
  prompt_file: promptContent
};

// 3. Escape the payload for the command line
const escapedPayload = JSON.stringify(JSON.stringify(payload));

// 4. Construct and run the curl command
const command = `curl -X POST "${API_URL}" -H "Content-Type: application/json" -d ${escapedPayload}`;

console.log("\nExecuting command:\n", command, "\n");

try {
  const result = execSync(command).toString();
  console.log("✅ API Response:");
  console.log(JSON.parse(result));
} catch (error) {
  console.error("❌ Command failed:", error.message);
}
