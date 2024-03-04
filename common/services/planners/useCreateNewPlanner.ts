import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;
import { NewPlannerResponse } from "./types";

const createNewPlanner = async (payload: {
  title: string;
  description: string;
}) => {
  const response = await api.post<NewPlannerResponse>(
    `/planners/create-planner`,
    payload
  );

  return response;
};

export const useCreatePlanner = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: { title: string; description: string }) =>
      createNewPlanner(payload),

    {
      // THIS onSuccess will refetch all planners (by key : "allPlanner") (when we create new planner) to update number of current planners in plannerList
      onSuccess: () => {
        queryClient.invalidateQueries("allPlanners");
      },
    }
  );
};
