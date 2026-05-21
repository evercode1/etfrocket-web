import api from "./client";

export async function getPortfolioCompare(portfolioId, params = {}) {
  const response = await api.get(`/portfolio-compare/${portfolioId}`, {
    params,
  });

  return response.data;
}
