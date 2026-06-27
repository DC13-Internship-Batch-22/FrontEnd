import type { PagedOrderParams } from "@/types/order";
import apiClient from "../config/api-client"

export const orderService = {
  async getOrdersPaged(params: PagedOrderParams) {
    const response = await apiClient.get('/orders', { params });
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
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data;
  },

  async updateOrderItems(id: number, items: { productId: number; quantity: number }[]) {
    const response = await apiClient.post(`/orders/${id}/override`, items);
    return response.data;
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await apiClient.post(`/orders/${id}/status`, status);
    return response.data;
  },
};
