import apiClient from "../config/api-client";
import type {
  TablePageResponse,
  TableRequest,
  TableResponse,
} from "@/types/table";

export const tableService = {
  async getTables(page = 0, size = 50) {
    const response = await apiClient.get<TablePageResponse>("/api/tables", {
      params: { page, size },
    });
    return response.data;
  },

  async getTableById(id: number) {
    const response = await apiClient.get<TableResponse>(`/api/tables/${id}`);
    return response.data;
  },

  async createTable(payload: TableRequest) {
    const response = await apiClient.post<TableResponse>("/api/tables", payload);
    return response.data;
  },

  async updateTable(id: number, payload: TableRequest) {
    const response = await apiClient.put<TableResponse>(
      `/api/tables/${id}`,
      payload
    );
    return response.data;
  },

  async deleteTable(id: number) {
    await apiClient.delete(`/api/tables/${id}`);
  },
};
