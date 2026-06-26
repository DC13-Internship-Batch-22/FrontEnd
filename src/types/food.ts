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
