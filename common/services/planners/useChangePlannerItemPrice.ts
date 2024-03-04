import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

interface EditItemPriceAndCurrency {
  plannerItemId: number;
  currencyId: number;
  price: string;
}

const changePlannerItemPrice = async (payload: EditItemPriceAndCurrency) => {
  const response = await api.post(
    `/planner-items/save-price-of-planner-item/${payload.plannerItemId}/${payload.price}/${payload.currencyId}`
  );
  return response;
};

export const useChangePlannerItem = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: EditItemPriceAndCurrency) => changePlannerItemPrice(payload),
    {
      onSuccess: () => queryClient.invalidateQueries("plannerItems"),
    }
  );
};
