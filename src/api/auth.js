import api from "./client";

export async function login(payload) {
  const response = await api.post("/login", payload);

  return response.data;
}

export async function register(payload) {
  const response = await api.post("/register", payload);

  return response.data;
}

export async function logout() {
  const response = await api.post("/logout");

  return response.data;
}

export async function getAuthenticatedUser() {
  const response = await api.get("/user");

  return response.data;
}
