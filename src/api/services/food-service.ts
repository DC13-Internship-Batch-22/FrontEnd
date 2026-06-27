import type { DishPayload } from "@/types/food";
import apiClient from "../config/api-client"

export const foodService = {
  async getFoods() {
    const response = await apiClient.get('/foods');
    return response.data;
  },
  async createFood(body: DishPayload) {
    const response = await apiClient.post('/foods', body);
    return response.data;
  },

  async updateFood(id: number, body: DishPayload) {
    const response = await apiClient.patch(`/foods/${id}`, body);
    return response.data;
  },

  async deleteFood(id: number) {
    const response = await apiClient.delete(`/foods/${id}`);
    return response.data;
  },
};
