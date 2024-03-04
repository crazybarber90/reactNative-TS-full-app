// export const linkProductToPlannerApi = (payload) => {
//   return api
//     .post(
//       `/planner-items/link-product-to-planner/${payload.plannerId}/${payload.contentId}`
//     )
//     .then((data) => data.data);
// };

import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation } = nodeModuleImports;

export interface AddProductToPlannerProps {
  contentId: number;
  plannerId: number;
}

const addProductToPlanner = async (payload: AddProductToPlannerProps) => {
  const response = await api.post(
    `/planner-items/link-product-to-planner/${payload.plannerId}/${payload.contentId}`
  );

  console.log("RESPONSE ADD PRODUCT TO PLANNER", response);

  return response;
};

export const useAddProductToPlanner = () => {
  return useMutation((payload: AddProductToPlannerProps) =>
    addProductToPlanner(payload)
  );
};
