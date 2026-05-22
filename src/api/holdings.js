// src/api/holdings.js
import api from "./client";

export async function getPortfolioHoldings(portfolioId) {
  const response = await api.get(`/portfolio-holdings/${portfolioId}`);

  return response.data;
}
