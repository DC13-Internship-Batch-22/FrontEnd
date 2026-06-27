export type FoodStatus = 'AVAILABLE';

export interface Food {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  status: FoodStatus;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DishPayload {
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  status: FoodStatus;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}