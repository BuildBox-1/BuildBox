/**
 * Anthropic Claude API Client Library
 * A clean, reusable wrapper for Anthropic's Claude API
 *
 * Install: npm install @anthropic-ai/sdk
 * Docs: https://docs.anthropic.com
 */

const Anthropic = require("@anthropic-ai/sdk");

class ClaudeClient {
  /**
   * @param {string} apiKey - Your Anthropic API key (or set ANTHROPIC_API_KEY env var)
   * @param {object} options - Optional config overrides
   */
  constructor(apiKey, options = {}) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.defaultModel = options.defaultModel || "claude-sonnet-4-5";
    this.defaultMaxTokens = options.maxTokens || 1024;
  }

  // ─────────────────────────────────────────────
  //  TEXT GENERATION
  // ─────────────────────────────────────────────

  /**
   * Generate a text response from a prompt.
   * @param {string} prompt
   * @param {object} opts
   * @returns {Promise<string>}
   */
  async chat(prompt, opts = {}) {
    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      system: opts.systemPrompt,
      messages: [{ role: "user", content: prompt }],
      temperature: opts.temperature ?? 0.7,
      ...opts.extra,
    });

    return res.content[0].text.trim();
  }

  /**
   * Multi-turn conversation (stateful).
   * Pass in a `history` array of {role, content} objects.
   * @param {Array} history
   * @param {string} newUserMessage
   * @param {object} opts
   * @returns {Promise<{reply: string, updatedHistory: Array}>}
   */
  async converse(history = [], newUserMessage, opts = {}) {
    const messages = [...history, { role: "user", content: newUserMessage }];

    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      system: opts.systemPrompt,
      messages,
      temperature: opts.temperature ?? 0.7,
    });

    const assistantReply = res.content[0].text.trim();
    return {
      reply: assistantReply,
      updatedHistory: [
        ...messages,
        { role: "assistant", content: assistantReply },
      ],
    };
  }

  /**
   * Stream a response token by token.
   * @param {string} prompt
   * @param {function} onChunk - Called with each text chunk
   * @param {object} opts
   * @returns {Promise<string>} Full response text
   */
  async stream(prompt, onChunk, opts = {}) {
    const stream = this.client.messages.stream({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      system: opts.systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    let fullText = "";
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        const chunk = event.delta.text;
        fullText += chunk;
        onChunk(chunk);
      }
    }
    return fullText;
  }

  // ─────────────────────────────────────────────
  //  STRUCTURED OUTPUT
  // ─────────────────────────────────────────────

  /**
   * Generate a JSON response from a prompt.
   * @param {string} prompt
   * @param {object} opts
   * @returns {Promise<object>}
   */
  async generateJSON(prompt, opts = {}) {
    const systemPrompt =
      opts.systemPrompt ||
      "You are a helpful assistant. Always respond with valid JSON only. No explanation, no markdown, no code fences.";

    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
      temperature: opts.temperature ?? 0.3,
    });

    const raw = res.content[0].text.trim();
    // Strip any accidental markdown fences
    const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(clean);
  }

  // ─────────────────────────────────────────────
  //  TOOL USE (FUNCTION CALLING)
  // ─────────────────────────────────────────────

  /**
   * Call Claude with tools/functions it can invoke.
   * @param {string} prompt
   * @param {Array} tools - Array of Anthropic tool definitions
   * @param {object} opts
   * @returns {Promise<{text: string|null, toolUse: object|null, raw: object}>}
   */
  async chatWithTools(prompt, tools, opts = {}) {
    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      system: opts.systemPrompt,
      tools,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = res.content.find((b) => b.type === "text");
    const toolBlock = res.content.find((b) => b.type === "tool_use");

    return {
      text: textBlock?.text?.trim() || null,
      toolUse: toolBlock
        ? { name: toolBlock.name, input: toolBlock.input, id: toolBlock.id }
        : null,
      stopReason: res.stop_reason,
      raw: res,
    };
  }

  // ─────────────────────────────────────────────
  //  VISION (Image Analysis)
  // ─────────────────────────────────────────────

  /**
   * Analyze an image from a URL.
   * @param {string} imageUrl
   * @param {string} question
   * @param {object} opts
   * @returns {Promise<string>}
   */
  async analyzeImageFromURL(
    imageUrl,
    question = "Describe this image.",
    opts = {}
  ) {
    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: imageUrl },
            },
            { type: "text", text: question },
          ],
        },
      ],
    });
    return res.content[0].text.trim();
  }

  /**
   * Analyze an image from base64 data.
   * @param {string} base64Data - base64-encoded image
   * @param {string} mediaType - e.g. "image/jpeg", "image/png"
   * @param {string} question
   * @param {object} opts
   * @returns {Promise<string>}
   */
  async analyzeImageFromBase64(
    base64Data,
    mediaType = "image/jpeg",
    question = "Describe this image.",
    opts = {}
  ) {
    const res = await this.client.messages.create({
      model: opts.model || this.defaultModel,
      max_tokens: opts.maxTokens || this.defaultMaxTokens,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64Data },
            },
            { type: "text", text: question },
          ],
        },
      ],
    });
    return res.content[0].text.trim();
  }

  // ─────────────────────────────────────────────
  //  DOCUMENT ANALYSIS (PDF / Text files)
  // ─────────────────────────────────────────────

  /**
   * Analyze a document (plain text) with Claude.
   * @param {string} documentText
   * @param {string} instruction
   * @param {object} opts
   * @returns {Promise<string>}
   */
  async analyzeDocument(documentText, instruction, opts = {}) {
    const prompt = `<document>\n${documentText}\n</document>\n\n${instruction}`;
    return this.chat(prompt, opts);
  }

  // ─────────────────────────────────────────────
  //  UTILITY
  // ─────────────────────────────────────────────

  /**
   * Count tokens for a prompt (useful for estimating cost).
   * @param {string} prompt
   * @param {object} opts
   * @returns {Promise<number>}
   */
  async countTokens(prompt, opts = {}) {
    const res = await this.client.messages.countTokens({
      model: opts.model || this.defaultModel,
      messages: [{ role: "user", content: prompt }],
    });
    return res.input_tokens;
  }
}

module.exports = ClaudeClient;
