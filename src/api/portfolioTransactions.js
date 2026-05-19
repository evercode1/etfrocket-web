import api from "./client";

export async function createPortfolioTransaction(portfolioId, data) {
  const response = await api.post(
    `/create-portfolio-transaction/${portfolioId}`,

    data,
  );

  return response.data;
}

export async function getEtfFilters() {
  const response = await api.get("/get-etf-filters");

  return response.data;
}

export async function csvUploadPortfolioTransactions(portfolioId, file) {
  const formData = new FormData();

  formData.append("csv_file", file);

  const response = await api.post(
    `/csv-upload-portfolio-transactions/${portfolioId}`,

    formData,

    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function listPortfolioTransactions(portfolioId, params = {}) {
  const response = await api.get(
    `/list-portfolio-transactions/${portfolioId}`,
    {
      params,
    },
  );

  return response.data;
}
