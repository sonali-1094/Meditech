const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-20250514";

const getApiKey = () =>
  import.meta.env.VITE_CLAUDE_API_KEY ||
  import.meta.env.VITE_ANTHROPIC_API_KEY ||
  import.meta.env.CLAUDE_API_KEY ||
  import.meta.env.ANTHROPIC_API_KEY;

export const isClaudeConfigured = () => Boolean(getApiKey());

export const parseClaudeJson = (text) => {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(withoutFence);
};

export const askClaude = async ({ prompt, system, maxTokens = 800 }) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "Claude API key missing. Add VITE_CLAUDE_API_KEY, VITE_ANTHROPIC_API_KEY, CLAUDE_API_KEY, or ANTHROPIC_API_KEY to src/.env."
    );
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_CLAUDE_MODEL || import.meta.env.CLAUDE_MODEL || DEFAULT_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content?.find((item) => item.type === "text")?.text || "";
};
