import apiClient from "../config/api-client"

export const orderService = {
  async getOrders() {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  async getOrderById(id: number) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(body: any) {
    const response = await apiClient.post('/orders', body);
    return response.data
  },

  async updateOrder(id: number, body: any) {
    const response = await apiClient.put(`/orders/${id}`, body);
    return response.data;
  },

  async deleteOrder(id: number) {
    const response = await apiClient.delete(`/oders/${id}`);
    return response.data;
  },
};
