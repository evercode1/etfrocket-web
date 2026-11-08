import api from "./client";

export async function getPipelineHealth() {
  const response = await api.get("/admin/pipeline-health");

  return response.data;
}

/*
| Manual AUM (fund data) runs: scope = "problems" | "issuer" | "all".
*/
export async function startManualRun(scope, issuerId = null) {
  const response = await api.post("/admin/pipeline-health/runs", {
    scope,
    issuer_id: issuerId,
  });

  return response.data;
}

export async function getLatestManualRun() {
  const response = await api.get("/admin/pipeline-health/runs/latest");

  return response.data;
}

export async function getManualRun(id) {
  const response = await api.get(`/admin/pipeline-health/runs/${id}`);

  return response.data;
}

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
