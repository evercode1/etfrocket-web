import api from "./client";

export async function getCronReports() {
  const response = await api.get("/admin/cron-reports");

  return response.data;
}

export async function getImportLogs(params = {}) {
  const response = await api.get(
    "/import-logs",

    {
      params,
    },
  );

  return response.data;
}

export async function getImportLog(id) {
  const response = await api.get(`/import-log/${id}`);

  return response.data;
}
