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

export async function verifyAccount(token) {
  const response = await api.get(`/account/verify/${token}`);

  return response.data;
}

export async function requestPasswordResetToken(payload) {
  const response = await api.post("/request-password-token", payload);

  return response.data;
}

export async function getPasswordResetForm(token) {
  const response = await api.get(`/get-password-reset-form/${token}`);

  return response.data;
}

export async function resetPassword(payload) {
  const response = await api.post("/password-reset", payload);

  return response.data;
}
