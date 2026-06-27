import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services";
import type { PagedOrderParams } from "@/types/order";

export function useOrdersPaged(params: PagedOrderParams) {
  return useQuery({
    queryKey: ['orders', { params }],
    queryFn: () => orderService.getOrdersPaged(params),
    placeholderData: keepPreviousData,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderItems(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: { productId: number; quantity: number }[]) =>
      orderService.updateOrderItems(id, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  })
}

export function useUpdateOrderStatus(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderService.updateOrderStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  })
}
