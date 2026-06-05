import api from "./client";

export async function getAdminSelects() {
  const response = await api.get("/admin/admin-selects");

  return response.data;
}
