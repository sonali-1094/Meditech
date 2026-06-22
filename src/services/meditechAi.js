const API_BASE = import.meta.env.VITE_AI_API_URL || "/api";
const REQUEST_TIMEOUT_MS = 12000;

async function post(path, payload) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `AI API request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The AI service took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function get(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `AI API request failed: ${response.status}`);
  }

  return data;
}

export const meditechAi = {
  health: () => get("/health"),
  predictDisease: (payload) => post("/ai/disease-predict", payload),
  analyzeSentiment: (payload) => post("/ai/sentiment", payload),
  chat: (payload) => post("/ai/chat", payload),
  predictRisk: (payload) => post("/ai/risk", payload),
  recommendDoctors: (payload) => post("/ai/doctors", payload),
  analyzeReport: (payload) => post("/ai/report/analyze", payload),
  healthScore: (payload) => post("/ai/health-score", payload),
  recommendations: (payload) => post("/ai/recommendations", payload),
};
