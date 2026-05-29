import api from "./client";

export async function getPortfolioCompare(portfolioId, params = {}) {
  const response = await api.get(`/portfolio-compare/${portfolioId}`, {
    params,
  });

  return response.data;
}

export async function getCompareSymbols(
  symbols = [],

  params = {},
) {
  const response = await api.get(
    "/compare-symbols",

    {
      params: {
        symbols,

        metric: params.metric || "price",

        range: params.range || "90d",
      },
    },
  );

  return response.data;
}

export async function getMetricExplorer(params = {}) {
  const response = await api.get(
    "/metric-explorer",

    {
      params,
    },
  );

  return response.data;
}

export async function runBackTest(payload) {
  const response = await api.post(
    "/back-testing",

    payload,
  );

  return response.data;
}

export async function getSecuritySelects() {
  const response = await api.get("/get-security-selects");

  return response.data;
}
