import api from "./client";

export async function getMySettings() {
  const response = await api.get("/my-settings");

  return response.data;
}

export async function updateMyEmail(payload) {
  const response = await api.post("/update-my-email", payload);

  return response.data;
}

export async function updateMyUserName(payload) {
  const response = await api.post("/update-my-user-name", payload);

  return response.data;
}

export async function updatePassword(payload) {
  const response = await api.post("/update-password", payload);

  return response.data;
}
