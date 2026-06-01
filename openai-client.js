/**
 * OpenAI API Client Library
 * A clean, reusable wrapper for OpenAI's API
 *
 * Install: npm install openai
 * Docs: https://platform.openai.com/docs
 */

const OpenAI = require("openai");

class OpenAIClient {
  /**
   * @param {string} apiKey - Your OpenAI API key (or set OPENAI_API_KEY env var)
   * @param {object} options - Optional config overrides
   */
  constructor(apiKey, options = {}) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
      ...options,
    });
    this.defaultModel = options.defaultModel || "gpt-4o";
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
    const messages = opts.systemPrompt
      ? [
          { role: "system", content: opts.systemPrompt },
          { role: "user", content: prompt },
        ]
      : [{ role: "user", content: prompt }];

    const res = await this.client.chat.completions.create({
      model: opts.model || this.defaultModel,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 1024,
      ...opts.extra,
    });

    return res.choices[0].message.content.trim();
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

    const res = await this.client.chat.completions.create({
      model: opts.model || this.defaultModel,
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens ?? 1024,
    });

    const assistantMessage = res.choices[0].message;
    return {
      reply: assistantMessage.content.trim(),
      updatedHistory: [...messages, assistantMessage],
    };
  }

  /**
   * Stream a response token by token.
   * @param {string} prompt
   * @param {function} onChunk - Called with each text chunk
   * @param {object} opts
   */
  async stream(prompt, onChunk, opts = {}) {
    const stream = await this.client.chat.completions.create({
      model: opts.model || this.defaultModel,
      messages: [{ role: "user", content: prompt }],
      stream: true,
      temperature: opts.temperature ?? 0.7,
    });

    let fullText = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || "";
      fullText += delta;
      onChunk(delta);
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
      "You are a helpful assistant. Always respond with valid JSON only. No explanation or markdown.";

    const res = await this.client.chat.completions.create({
      model: opts.model || this.defaultModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: opts.temperature ?? 0.3,
    });

    return JSON.parse(res.choices[0].message.content);
  }

  // ─────────────────────────────────────────────
  //  EMBEDDINGS
  // ─────────────────────────────────────────────

  /**
   * Generate a vector embedding for a string.
   * @param {string} text
   * @param {object} opts
   * @returns {Promise<number[]>}
   */
  async embed(text, opts = {}) {
    const res = await this.client.embeddings.create({
      model: opts.model || "text-embedding-3-small",
      input: text,
    });
    return res.data[0].embedding;
  }

  /**
   * Batch embed multiple strings.
   * @param {string[]} texts
   * @param {object} opts
   * @returns {Promise<number[][]>}
   */
  async embedBatch(texts, opts = {}) {
    const res = await this.client.embeddings.create({
      model: opts.model || "text-embedding-3-small",
      input: texts,
    });
    return res.data.map((d) => d.embedding);
  }

  // ─────────────────────────────────────────────
  //  IMAGE GENERATION (DALL·E)
  // ─────────────────────────────────────────────

  /**
   * Generate an image from a text prompt.
   * @param {string} prompt
   * @param {object} opts
   * @returns {Promise<string>} Image URL
   */
  async generateImage(prompt, opts = {}) {
    const res = await this.client.images.generate({
      model: opts.model || "dall-e-3",
      prompt,
      n: 1,
      size: opts.size || "1024x1024",
      quality: opts.quality || "standard",
    });
    return res.data[0].url;
  }

  // ─────────────────────────────────────────────
  //  VISION (GPT-4o)
  // ─────────────────────────────────────────────

  /**
   * Analyze an image from URL.
   * @param {string} imageUrl
   * @param {string} question
   * @param {object} opts
   * @returns {Promise<string>}
   */
  async analyzeImage(imageUrl, question = "Describe this image.", opts = {}) {
    const res = await this.client.chat.completions.create({
      model: opts.model || "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: question },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: opts.maxTokens ?? 1024,
    });
    return res.choices[0].message.content.trim();
  }

  // ─────────────────────────────────────────────
  //  MODERATION
  // ─────────────────────────────────────────────

  /**
   * Check if content violates OpenAI usage policies.
   * @param {string} text
   * @returns {Promise<{flagged: boolean, categories: object}>}
   */
  async moderate(text) {
    const res = await this.client.moderations.create({ input: text });
    const result = res.results[0];
    return {
      flagged: result.flagged,
      categories: result.categories,
    };
  }
}

module.exports = OpenAIClient;
