// src/api/aiSignals.js

import api from "./client";

export async function getAiSignals() {
  const response = await api.get("/get-ai-signals");

  return response.data;
}
