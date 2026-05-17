import api from "./client";

export async function listMySupportTickets(params = {}) {
  const response = await api.get("/my-support-tickets", {
    params,
  });

  return response.data;
}

export async function viewMySupportTicket(id) {
  const response = await api.get(`/my-support-ticket/${id}`);

  return response.data;
}

export async function getNewSupportTicketForm() {
  const response = await api.get("/new-support-ticket-form");

  return response.data;
}

export async function createSupportTicket(payload) {
  const response = await api.post("/create-support-ticket", payload);

  return response.data;
}

export async function respondToSupport(payload) {
  const response = await api.post("/respond-to-support-response", payload);

  return response.data;
}

export async function markSupportResponseAsRead(payload) {
  const response = await api.post("/mark-support-response-as-read", payload);

  return response.data;
}
