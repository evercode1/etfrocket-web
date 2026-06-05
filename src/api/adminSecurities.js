import api from "./client";

export async function listSecuritiesData(params = {}) {
  const response = await api.get("/admin/list-securities-data", {
    params,
  });

  return response.data;
}

export async function securityDataSelects() {
  const response = await api.get("/admin/security-data-selects");

  return response.data;
}

export async function showSecurityData(id) {
  const response = await api.get(`/admin/security-data-show/${id}`);

  return response.data;
}

export async function storeSecurityData(payload) {
  const response = await api.post("/admin/security-data-store", payload);

  return response.data;
}

export async function updateSecurityData(id, payload) {
  const response = await api.put(`/admin/security-data-update/${id}`, payload);

  return response.data;
}

export async function retireSecurityData(id) {
  const response = await api.put(`/admin/security-data-retire/${id}`);

  return response.data;
}
