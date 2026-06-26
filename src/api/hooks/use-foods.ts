import { useQuery } from "@tanstack/react-query";
import { foodService } from "../services";

export function useFoods() {
  return useQuery({
    queryKey: ['foods'],
    queryFn: () => foodService.getFoods(),
  });
};
