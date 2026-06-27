import type { Category, CategoryPayload } from "@/types/category";
import apiClient from "../config/api-client";

export const categoryService = {
  async getAll() {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },

  async getById(id: number) {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(payload: CategoryPayload) {
    const response = await apiClient.post<Category>("/categories", payload);
    return response.data;
  },

  async update(id: number, payload: Partial<CategoryPayload>) {
    const response = await apiClient.patch<Category>(`/categories/${id}`, payload);
    return response.data;
  },

  async delete(id: number) {
    const response = await apiClient.delete<void>(`/categories/${id}`);
    return response.data;
  },
};
