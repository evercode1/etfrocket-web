import api from "./client";

export async function getEtfFilters() {
    const response = await api.get("/get-etf-filters");

    return response.data;
}

export async function getEtfs(params = {}) {
    const response = await api.get("/get-etfs", {
        params,
    });

    return response.data;
}

export async function compareEtfs(params = {}) {
    const response = await api.get("/compare-etfs", {
        params,
    });

    return response.data;
}
