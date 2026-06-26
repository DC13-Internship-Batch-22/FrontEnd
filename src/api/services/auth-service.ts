import axios from 'axios'
import type { AuthTokens, LoginPayload } from '@/types/auth';

const BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async login(body: LoginPayload) {
    const response = await axios.post<AuthTokens>(`${BASE_URL}/auth/login`, body);
    return response.data;
  },

  async refresh(refreshToken: string) {
    const response = await axios.post<AuthTokens>(`${BASE_URL}/auth/refresh`, { refreshToken });
    return response.data;
  }
}
