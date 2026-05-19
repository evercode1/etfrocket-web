import api from "./client";

export async function listPortfolios() {
  const response = await api.get("/list-portfolios");

  return response.data;
}

export async function getPortfolioCardSummaries() {
  const response = await api.get("/portfolio-card-summaries");

  return response.data;
}

export async function viewPortfolio(id) {
  const response = await api.get(`/view-portfolio/${id}`);

  return response.data;
}

export async function getCreatePortfolioFormConfig() {
  const response = await api.get("/get-create-portfolio-form-config");

  return response.data;
}

export async function createPortfolio(payload) {
  const response = await api.post("/create-portfolio", payload);

  return response.data;
}

export async function getUpdatePortfolioFormConfig(id) {
  const response = await api.get(`/get-update-portfolio-form-config/${id}`);

  return response.data;
}

export async function updatePortfolio(id, payload) {
  const response = await api.put(`/update-portfolio/${id}`, payload);

  return response.data;
}

export async function deletePortfolio(id) {
  const response = await api.delete(`/delete-portfolio/${id}`);

  return response.data;
}

export async function listPortfolioTransactions(portfolioId) {
  const response = await api.get(`/list-portfolio-transactions/${portfolioId}`);

  return response.data;
}

export async function getCreatePortfolioTransactionFormConfig(portfolioId) {
  const response = await api.get(
    `/get-create-portfolio-transaction-form-config/${portfolioId}`,
  );

  return response.data;
}

export async function createPortfolioTransaction(portfolioId, payload) {
  const response = await api.post(
    `/create-portfolio-transaction/${portfolioId}`,
    payload,
  );

  return response.data;
}

export async function getUpdatePortfolioTransactionFormConfig(id) {
  const response = await api.get(
    `/get-update-portfolio-transaction-form-config/${id}`,
  );

  return response.data;
}

export async function updatePortfolioTransaction(id, payload) {
  const response = await api.put(
    `/update-portfolio-transaction/${id}`,
    payload,
  );

  return response.data;
}

export async function deletePortfolioTransaction(id) {
  const response = await api.delete(`/delete-portfolio-transaction/${id}`);

  return response.data;
}

export async function deleteAllPortfolioTransactions(portfolioId) {
  const response = await api.delete(
    `/delete-all-portfolio-transactions/${portfolioId}`,
  );

  return response.data;
}

export async function getImportPortfolioTransactionsConfig() {
  const response = await api.get("/get-import-portfolio-transactions-config");

  return response.data;
}

export async function importPortfolioTransactions(portfolioId, payload) {
  const response = await api.post(
    `/import-portfolio-transactions/${portfolioId}`,
    payload,
  );

  return response.data;
}

export async function exportPortfolioTransactions(portfolioId) {
  const response = await api.get(
    `/export-portfolio-transactions/${portfolioId}`,
    {
      responseType: "blob",
    },
  );

  return response.data;
}
