/**
 * examples.js
 * Usage examples for OpenAI and Anthropic Claude wrappers
 *
 * Set env vars before running:
 *   export OPENAI_API_KEY=sk-...
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *
 * Run: node examples.js
 */

const { AIClient, OpenAIClient, ClaudeClient } = require("./index");

// ─────────────────────────────────────────────────────────────
//  1. DIRECT OpenAI USAGE
// ─────────────────────────────────────────────────────────────
async function openAIExamples() {
  const ai = new OpenAIClient(); // uses OPENAI_API_KEY env var

  // Basic chat
  const reply = await ai.chat("What is the capital of France?");
  console.log("OpenAI chat:", reply);

  // With system prompt
  const poem = await ai.chat("Write a haiku about JavaScript", {
    systemPrompt: "You are a creative poet.",
    temperature: 0.9,
  });
  console.log("OpenAI poem:", poem);

  // JSON generation
  const data = await ai.generateJSON(
    "Return a JSON object with keys: name, age, city. Use random values."
  );
  console.log("OpenAI JSON:", data);

  // Streaming
  process.stdout.write("OpenAI stream: ");
  await ai.stream("Count from 1 to 5.", (chunk) => process.stdout.write(chunk));
  console.log();

  // Embedding
  const embedding = await ai.embed("Hello world");
  console.log("OpenAI embedding dimensions:", embedding.length);

  // Multi-turn conversation
  let history = [];
  const res1 = await ai.converse(history, "My name is Alex.");
  console.log("OpenAI converse 1:", res1.reply);

  const res2 = await ai.converse(res1.updatedHistory, "What is my name?");
  console.log("OpenAI converse 2:", res2.reply);
}

// ─────────────────────────────────────────────────────────────
//  2. DIRECT Claude USAGE
// ─────────────────────────────────────────────────────────────
async function claudeExamples() {
  const ai = new ClaudeClient(); // uses ANTHROPIC_API_KEY env var

  // Basic chat
  const reply = await ai.chat("What is the largest planet in our solar system?");
  console.log("Claude chat:", reply);

  // With system prompt
  const explanation = await ai.chat("Explain async/await in JavaScript", {
    systemPrompt: "You are a friendly coding tutor for beginners.",
    maxTokens: 200,
  });
  console.log("Claude explanation:", explanation);

  // JSON generation
  const data = await ai.generateJSON(
    "Return a JSON array of 3 programming languages with name and year_created fields."
  );
  console.log("Claude JSON:", data);

  // Streaming
  process.stdout.write("Claude stream: ");
  await ai.stream("Tell me a fun fact about the moon.", (chunk) =>
    process.stdout.write(chunk)
  );
  console.log();

  // Multi-turn conversation
  let history = [];
  const res1 = await ai.converse(history, "I am learning Python.");
  console.log("Claude converse 1:", res1.reply);
  const res2 = await ai.converse(
    res1.updatedHistory,
    "What should I learn first?"
  );
  console.log("Claude converse 2:", res2.reply);

  // Tool use
  const tools = [
    {
      name: "get_weather",
      description: "Get current weather for a city",
      input_schema: {
        type: "object",
        properties: {
          city: { type: "string", description: "City name" },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Temperature unit",
          },
        },
        required: ["city"],
      },
    },
  ];

  const toolResult = await ai.chatWithTools(
    "What is the weather in Tokyo?",
    tools
  );
  console.log("Claude tool call:", toolResult.toolUse);

  // Token counting
  const tokens = await ai.countTokens("How many tokens is this sentence?");
  console.log("Claude token count:", tokens);
}

// ─────────────────────────────────────────────────────────────
//  3. UNIFIED CLIENT USAGE
// ─────────────────────────────────────────────────────────────
async function unifiedExamples() {
  const ai = new AIClient({
    openaiKey: process.env.OPENAI_API_KEY,
    claudeKey: process.env.ANTHROPIC_API_KEY,
    default: "openai",
  });

  // Use default provider (OpenAI)
  const reply1 = await ai.chat("Say hello!");
  console.log("Unified (default openai):", reply1);

  // Override provider
  const reply2 = await ai.chat("Say hello!", { provider: "claude" });
  console.log("Unified (override claude):", reply2);

  // Compare both providers
  const comparison = await ai.compareProviders(
    "In one sentence, what is machine learning?"
  );
  console.log("Comparison:\n  OpenAI:", comparison.openai);
  console.log("  Claude:", comparison.claude);

  // Fallback: try OpenAI first, fall back to Claude
  const { reply, usedProvider } = await ai.chatWithFallback(
    "What year was the internet invented?"
  );
  console.log(`Fallback result (used: ${usedProvider}):`, reply);
}

// ─────────────────────────────────────────────────────────────
//  RUN ALL
// ─────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log("\n═══ OpenAI Examples ═══\n");
    await openAIExamples();

    console.log("\n═══ Claude Examples ═══\n");
    await claudeExamples();

    console.log("\n═══ Unified Client Examples ═══\n");
    await unifiedExamples();
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
