// src/api/missionControl.js

import api from "./client";

export async function getPortfolioSelects() {
  const response = await api.get("/get-portfolio-selects");

  return response.data;
}

export async function getMissionControl(portfolioId = null) {
  const response = await api.get("/mission-control", {
    params: portfolioId ? { portfolio_id: portfolioId } : {},
  });

  return response.data;
}
