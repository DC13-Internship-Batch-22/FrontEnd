import apiClient from "../config/api-client"

export const foodService = {
  async getFoods() {
    const response = await apiClient.get('/foods');
    return response.data;
  },

  async updateFood() {
    const response = await apiClient.patch(`/foods/4`, {
      name: "ffff",
      price: 5,
      categoryId: 2,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      status: "AVAILABLE"
    });
    return response.data;
  },
};
