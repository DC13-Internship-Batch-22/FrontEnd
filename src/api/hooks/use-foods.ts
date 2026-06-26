import { useQuery } from "@tanstack/react-query";
import { foodService } from "../services/food-service";

export function useFoods() {
  return useQuery({
    queryKey: ['foods'],
    queryFn: () => foodService.getFoods(),
  });
};
