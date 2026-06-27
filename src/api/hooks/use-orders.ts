import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services";
import type { CreateOrderPayload, PagedOrderParams } from "@/types/order";

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

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOrderPayload) =>
      orderService.createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
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
    mutationFn: (status: string) => orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  })
}
