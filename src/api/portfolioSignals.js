import api from "./api";

export async function getPortfolioDistributionGrowthSignal(portfolioId) {
  const response = await api.get(
    `/portfolio-distribution-growth-signal/${portfolioId}`,
  );

  return response.data;
}
