/**
 * Unified AI Client
 * A single interface to use both OpenAI and Anthropic Claude
 *
 * Install: npm install openai @anthropic-ai/sdk
 */

const OpenAIClient = require("./openai-client");
const ClaudeClient = require("./claude-client");

class AIClient {
  /**
   * @param {object} config
   * @param {string} config.openaiKey  - OpenAI API key
   * @param {string} config.claudeKey  - Anthropic API key
   * @param {"openai"|"claude"} config.default - Default provider
   */
  constructor(config = {}) {
    this.openai = new OpenAIClient(config.openaiKey);
    this.claude = new ClaudeClient(config.claudeKey);
    this.defaultProvider = config.default || "openai";
  }

  /**
   * Get the active provider client.
   * @param {"openai"|"claude"|undefined} provider
   */
  _provider(provider) {
    const p = provider || this.defaultProvider;
    if (p === "openai") return this.openai;
    if (p === "claude") return this.claude;
    throw new Error(`Unknown provider: "${p}". Use "openai" or "claude".`);
  }

  /**
   * Generate a chat response using either provider.
   * @param {string} prompt
   * @param {object} opts - includes optional `provider: "openai"|"claude"`
   * @returns {Promise<string>}
   */
  async chat(prompt, opts = {}) {
    return this._provider(opts.provider).chat(prompt, opts);
  }

  /**
   * Multi-turn conversation using either provider.
   */
  async converse(history, newUserMessage, opts = {}) {
    return this._provider(opts.provider).converse(history, newUserMessage, opts);
  }

  /**
   * Stream a response using either provider.
   */
  async stream(prompt, onChunk, opts = {}) {
    return this._provider(opts.provider).stream(prompt, onChunk, opts);
  }

  /**
   * Generate JSON using either provider.
   */
  async generateJSON(prompt, opts = {}) {
    return this._provider(opts.provider).generateJSON(prompt, opts);
  }

  /**
   * Run the same prompt on BOTH providers and return both responses.
   * Great for comparisons, fallbacks, or ensemble decisions.
   * @param {string} prompt
   * @param {object} opts
   * @returns {Promise<{openai: string, claude: string}>}
   */
  async compareProviders(prompt, opts = {}) {
    const [openaiReply, claudeReply] = await Promise.all([
      this.openai.chat(prompt, opts),
      this.claude.chat(prompt, opts),
    ]);
    return { openai: openaiReply, claude: claudeReply };
  }

  /**
   * Try primary provider; fall back to secondary on error.
   * @param {string} prompt
   * @param {object} opts
   * @param {"openai"|"claude"} primary
   * @returns {Promise<{reply: string, usedProvider: string}>}
   */
  async chatWithFallback(prompt, opts = {}, primary = this.defaultProvider) {
    const secondary = primary === "openai" ? "claude" : "openai";
    try {
      const reply = await this._provider(primary).chat(prompt, opts);
      return { reply, usedProvider: primary };
    } catch (err) {
      console.warn(`[AIClient] ${primary} failed, falling back to ${secondary}. Error: ${err.message}`);
      const reply = await this._provider(secondary).chat(prompt, opts);
      return { reply, usedProvider: secondary };
    }
  }
}

module.exports = { AIClient, OpenAIClient, ClaudeClient };
