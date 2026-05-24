import api from "./client";

export async function getCronReports() {
  const response = await api.get("/admin/cron-reports");

  return response.data;
}
