// src/api/adminSupport.js

import api from "./client";

export async function listSupportTickets(params = {}) {
  const response = await api.get("/get-support-tickets", {
    params,
  });

  return response.data;
}

export async function viewSupportTicket(id) {
  const response = await api.get(`/support-ticket/${id}`);

  return response.data;
}

export async function replyToSupportTicket(payload) {
  const response = await api.post("/support-reply-to-ticket", payload);

  return response.data;
}

export async function closeSupportTicket(payload) {
  const response = await api.post("/close-ticket", payload);

  return response.data;
}

export async function getOpenSupportTicketCount() {
  const response = await api.get("/open-support-ticket-count");

  return response.data;
}
