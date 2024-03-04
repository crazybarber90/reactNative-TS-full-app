import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;
interface DeleteTaskProps {
  plannerItemId: number;
  plannerId: number;
}
const deletePlannerItem = async (payload: DeleteTaskProps) => {
  const response = await api.post(
    `/planner-items/delete-planner-item/${payload.plannerItemId}/${payload.plannerId}`
  );
  return response;
};

export const useDeletePlannerItem = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: DeleteTaskProps) => deletePlannerItem(payload), {
    onSuccess: () => queryClient.invalidateQueries("plannerItems"),
  });
};
