import api from "./client";

export async function getAdminSelects() {
  const response = await api.get("/admin/admin-selects");

  return response.data;
}

export async function getAdminSelect(key) {
  const response = await api.get(`/admin/admin-selects/${key}`);

  return response.data;
}

export async function createAdminSelectValue(key, payload) {
  const response = await api.post(`/admin/admin-selects/${key}`, payload);

  return response.data;
}

export async function updateAdminSelectValue(key, id, payload) {
  const response = await api.put(`/admin/admin-selects/${key}/${id}`, payload);

  return response.data;
}

export async function deleteAdminSelectValue(key, id) {
  const response = await api.delete(`/admin/admin-selects/${key}/${id}`);

  return response.data;
}
