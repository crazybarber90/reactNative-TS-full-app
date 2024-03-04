import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

interface EditDateItem {
  plannerItemId: number;
  scheduled_date: string;
}

const changePlannerItemDate = async (payload: EditDateItem) => {
  const response = await api.post(
    `/planner-items/save-scheduled-date/${payload.plannerItemId}`,
    {
      scheduled_date: payload.scheduled_date,
    }
  );
  return response;
};

export const useChangePlannerItemDate = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: EditDateItem) => changePlannerItemDate(payload),
    {
      onSuccess: () => queryClient.invalidateQueries("plannerItems"),
    }
  );
};
