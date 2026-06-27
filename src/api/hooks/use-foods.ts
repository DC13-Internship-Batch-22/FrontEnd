import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { foodService } from "../services";
import type { DishPayload } from "@/types/food";

// Hook lấy danh sách món ăn (Giữ nguyên cũ của bạn)
export function useFoods() {
  return useQuery({
    queryKey: ['foods'],
    queryFn: () => foodService.getFoods(),
  });
}

// ---- VIẾT THÊM ĐOẠN NÀY VÀO DƯỚI FILE ----

// Hook Thêm món mới
export function useCreateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: DishPayload) => foodService.createFood(body),
    onSuccess: () => {
      // Khi thêm thành công, tự động xóa cache để giao diện tự load lại món mới
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}

// Hook Cập nhật món ăn (PATCH)
export function useUpdateFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: DishPayload }) => 
      foodService.updateFood(id, body),
    onSuccess: () => {
      // Khi sửa thành công, ép buộc render lại danh sách mới nhất
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}

// Hook Xóa món ăn
export function useDeleteFood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => foodService.deleteFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });
}