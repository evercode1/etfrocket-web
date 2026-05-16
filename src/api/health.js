import api from "./client";

export async function healthCheck() {
    const response = await api.get("/health/check");

    return response.data;
}
