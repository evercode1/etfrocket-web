import api from "./client";

export async function getAumLeaderboard() {
  const response = await api.get("/aum-leaderboard");

  return response.data;
}

export async function getEtfSearchIndex() {
  const response = await api.get("/etf-search-index");

  return response.data;
}

export async function getAumHistory(symbol) {
  const response = await api.get(`/aum-history/${encodeURIComponent(symbol)}`);

  return response.data;
}
