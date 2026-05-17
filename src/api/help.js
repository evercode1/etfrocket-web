import api from "./client";

export async function listHelpArticles(params = {}) {
  const response = await api.get("/help-articles", {
    params,
  });

  return response.data;
}

export async function viewHelpArticle(slug) {
  const response = await api.get(`/help-article/${slug}`);

  return response.data;
}
