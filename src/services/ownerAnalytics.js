import api from "./api";

export const getOwnerAnalytics = async () => {
  const res = await api.get("/owner/analytics");
  return res.data;
};