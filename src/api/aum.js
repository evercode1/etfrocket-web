import api from "./client";

export async function getAumLeaderboard() {
  const response = await api.get("/aum-leaderboard");

  return response.data;
}
