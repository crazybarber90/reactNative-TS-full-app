import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

export const deletePlanner = async (id: number) => {
  const response = await api.post(`/planners/delete-planner/${id}`);

  return response;
};

export const useDeletePlanner = () => {
  const queryClient = useQueryClient();
  return useMutation((id: number) => deletePlanner(id), {
    onSuccess: () => queryClient.invalidateQueries("allPlanners"),
  });
};
