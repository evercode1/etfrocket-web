import api from "./client";

export async function getPortfolioDistributionGrowthSignal(portfolioId) {
  const response = await api.get(
    `/portfolio-distribution-growth-signal/${portfolioId}`,
  );

  return response.data;
}

export async function getPortfolioAumGrowthSignal(portfolioId) {
  const response = await api.get(`/portfolio-aum-growth-signal/${portfolioId}`);

  return response.data;
}
