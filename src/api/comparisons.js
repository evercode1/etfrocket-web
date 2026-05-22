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
