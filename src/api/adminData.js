import api from "./client";

export async function backfillPriceHistory(payload) {
  const response = await api.post("/data/backfill-price-history", payload);
  return response.data;
}

export async function calculateSecurityMetrics(payload) {
  const response = await api.post("/data/calculate-security-metrics", payload);
  return response.data;
}

export async function runAiDataExtractions(payload) {
  const response = await api.post("/data/run-ai-data-extractions", payload);
  return response.data;
}

export async function truncateTables(payload) {
  const response = await api.post("/data/truncate-tables", payload);
  return response.data;
}

export async function updatePriceHistory(payload) {
  const response = await api.put(
    "/admin/data/price-history",

    payload,
  );

  return response.data;
}
