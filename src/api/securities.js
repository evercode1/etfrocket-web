import api from "./client";

export async function getSecurityFilters() {
  const response = await api.get("/get-security-filters");

  return response.data;
}

export async function getSecuritySelects() {
  const response = await api.get("/get-security-selects");

  return response.data;
}

export async function getSecurities(params = {}) {
  const response = await api.get("/get-securities", {
    params,
  });

  return response.data;
}

export async function compareSecurities(params = {}) {
  const response = await api.get("/compare-securities", {
    params,
  });

  return response.data;
}

export async function listSecuritiesOwnedByUser(portfolioId) {
  const response = await api.get(
    `/list-securities-owned-by-user/${portfolioId}`,
  );

  return response.data;
}

export async function getSecurityHoverCard(symbol) {
  const response = await api.get(`/security-hover-card/${symbol}`);

  return response.data.data;
}

export async function getSecurityDetails(
  symbol,
  performanceRangeTypeId,
  startDate,
) {
  const response = await api.get(`/security-details/${symbol}`, {
    params: {
      performance_range_type_id: performanceRangeTypeId,
      start_date: startDate,
    },
  });

  return response.data;
}
