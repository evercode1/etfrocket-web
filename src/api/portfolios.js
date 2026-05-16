import api from "./client";

export async function listPortfolios() {
    const response = await api.get("/list-portfolios");

    return response.data;
}

export async function viewPortfolio(id) {
    const response = await api.get(`/view-portfolio/${id}`);

    return response.data;
}

export async function createPortfolio(payload) {
    const response = await api.post("/create-portfolio", payload);

    return response.data;
}

export async function updatePortfolio(id, payload) {
    const response = await api.put(`/update-portfolio/${id}`, payload);

    return response.data;
}

export async function deletePortfolio(id) {
    const response = await api.delete(`/delete-portfolio/${id}`);

    return response.data;
}
