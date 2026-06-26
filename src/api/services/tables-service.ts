import apiClient from "../config/api-client";


export const getTables = async () => {
  const token = localStorage.getItem("token");

  const response = await apiClient.get(`/api/tables?page=0&size=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};