import api from "./client";

export async function getDividendIntelligence(portfolioId) {
  const response = await api.get(`/dividend-intelligence/${portfolioId}`);

  return response.data;
}

export async function getDividendHistory(portfolioId, params = {}) {
  const response = await api.get(`/dividend-history/${portfolioId}`, {
    params,
  });

  return response.data;
}

export async function getDividendCalendar(portfolioId) {
  const response = await api.get(`/dividend-calendar/${portfolioId}`);

  return response.data;
}
