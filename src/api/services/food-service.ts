import type { Food } from "@/types/food";
import apiClient from "../config/api-client"

export const foodService = {
  async getFoods(categoryId?: number) {
    const params = categoryId ? { categoryId } : {};
    const response = await apiClient.get<Food[]>('/foods', { params });
    return response.data;
  },
  async createFood(body: any) {
    // Nếu imageUrl truyền vào là một File object (người dùng up file từ máy tính)
    if (body.imageUrl && typeof body.imageUrl !== 'string') {
      const formData = new FormData();
      formData.append('name', body.name);
      formData.append('price', String(body.price));
      formData.append('categoryId', String(body.categoryId));
      formData.append('status', body.status || 'AVAILABLE');
      formData.append('image', body.imageUrl); // Đính kèm file ảnh vật lý (kiểm tra lại key 'image' hoặc 'file' tùy thuộc Backend yêu cầu)

      const response = await apiClient.post('/foods/with-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Bắt buộc khi gửi kèm file
        },
      });
      return response.data;
    } 
    
    // Trường hợp ngược lại (nếu vẫn nhập link URL dạng text như cũ)
    const response = await apiClient.post('/foods', body);
    return response.data;
  },

  async updateFood(id: number, body: any) {
    if (body.imageUrl && typeof body.imageUrl !== 'string') {
      const formData = new FormData();
      formData.append('name', body.name);
      formData.append('price', String(body.price));
      formData.append('categoryId', String(body.categoryId));
      formData.append('status', body.status || 'AVAILABLE');
      formData.append('image', body.imageUrl); // key nhận file của backend

      const response = await apiClient.patch(`/foods/${id}/with-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }

    const response = await apiClient.patch(`/foods/${id}`, body);
    return response.data;
  },

  async deleteFood(id: number) {
    const response = await apiClient.delete(`/foods/${id}`);
    return response.data;
  },
};
