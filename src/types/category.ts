export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  description: string;
}
