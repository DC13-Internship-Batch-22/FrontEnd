import apiClient from "../config/api-client"

export const foodService = {
  async getFoods() {
    const response = await apiClient.get('/foods');
    return response.data;
  },
};
