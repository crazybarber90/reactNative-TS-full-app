// API FOR GETTING ALL SINGLE PLANNER ITEMS

import api from "../apiConfig";
import nodeModuleImports from "../imports";
import { PlannerItem } from "./types";
const { useQuery, useQueries } = nodeModuleImports;

export const getPlannerItems = async (
  plannerId: number
): Promise<PlannerItem[]> => {
  const response = await api.get<PlannerItem[]>(
    `/planner-items/get-items/${plannerId}`
  );

  return response.data;
};

export const useGetPlannerItems = (plannerId: number) => {
  return useQuery("plannerItems", () => getPlannerItems(plannerId));
};

export const useGetAllPlannerItems = () => {
  // return useQueries(['plannerItems', plannerIds.map((el) => el)])

  // plannerIds.map((el) => useQueries());
  return (plannerIds: number[]) =>
    useQueries(
      plannerIds.map((planner) => {
        return {
          queryKey: ["plannerItems", planner],
          queryFn: () => getPlannerItems(planner),
        };
      })
    );
};
