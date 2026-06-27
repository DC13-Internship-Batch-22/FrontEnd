import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { foodService } from "../services";
import type { DishPayload } from "@/types/food";

export function useFoods(categoryId?: number) {
  return useQuery({
    queryKey: ['foods', categoryId],
    queryFn: () => foodService.getFoods(categoryId),
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DishPayload) => foodService.createFood(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}

export function useUpdateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: DishPayload }) =>
      foodService.updateFood(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}

export function useDeleteFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => foodService.deleteFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}
