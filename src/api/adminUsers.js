import api from "./client";

export async function listUsers(params = {}) {
  const response = await api.get("/manage-users", { params });

  return response.data;
}

export async function searchUsers(keyword, params = {}) {
  const response = await api.get(`/manage-users/search/${keyword}`, {
    params,
  });

  return response.data;
}

export async function viewUser(id) {
  const response = await api.get(`/manage-user/${id}`);

  return response.data;
}

export async function updateUser(id, payload) {
  const response = await api.post(`/manage-user/${id}`, payload);

  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/delete-user/${id}`);

  return response.data;
}

export async function getUserSignupStats(range = "1y") {
  const response = await api.get("/user-signup-stats", {
    params: {
      range,
    },
  });

  return response.data;
}
