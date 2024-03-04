import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

const changeCalculatePrice = async (payload: {
  plannerItemId: number;
  value: number;
}) => {
  const response = await api.post(
    `/planner-items/change-calculate-price/${payload.plannerItemId}/${payload.value}`
  );

  return response.data;
};

export const useChangeCalculatePrice = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: { plannerItemId: number; value: number }) =>
      changeCalculatePrice(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("plannerItems");
      },
    }
  );
};
