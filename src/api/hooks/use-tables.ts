import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { TableRequest } from "@/types/table";
import { tableService } from "../services";

export function useGetTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tableService.getTables(),
    placeholderData: keepPreviousData,
  });
}

export function useGetTableById(id: number) {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tableService.getTableById(id),
    enabled: !!id,
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TableRequest) => tableService.createTable(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TableRequest }) =>
      tableService.updateTable(id, payload),
    onSuccess: (updatedTable, { id }) => {
      queryClient.setQueryData(['tables', id], updatedTable);
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tableService.deleteTable(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['tables', id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
