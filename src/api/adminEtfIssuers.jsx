import api from "./client";

export async function listEtfIssuers(params = {}) {
  const response = await api.get("/admin/list-etf-issuers", {
    params,
  });

  return response.data;
}

export async function etfIssuerSelects() {
  const response = await api.get("/admin/etf-issuer-selects");

  return response.data;
}

export async function showEtfIssuer(id) {
  const response = await api.get(`/admin/etf-issuer-show/${id}`);

  return response.data;
}

export async function storeEtfIssuer(payload) {
  const response = await api.post("/admin/etf-issuer-store", payload);

  return response.data;
}

export async function updateEtfIssuer(id, payload) {
  const response = await api.put(`/admin/etf-issuer-update/${id}`, payload);

  return response.data;
}

export async function retireEtfIssuer(id) {
  const response = await api.put(`/admin/etf-issuer-retire/${id}`);

  return response.data;
}
