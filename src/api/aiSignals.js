// src/api/aiSignals.js

import api from "./client";

export async function getAiSignals() {
  const response = await api.get("/get-ai-signals");

  return response.data;
}

export async function getAiSignal(id) {
  const response = await api.get(`/show-ai-signal/${id}`);

  return response.data;
}
