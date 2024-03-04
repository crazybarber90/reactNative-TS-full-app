import api from "../apiConfig";
import nodeModuleImports from "../imports";
import { Catalog, Product } from "../products/types";
import { isCatalog } from "../products/useGetCategorieProducts";
const { useQuery } = nodeModuleImports;

const getAuthorProducts = async (payload: {
  userId: number;
  page: number;
}): Promise<(Catalog | Product)[]> => {
  const response = await api.get<(Catalog | Product)[]>(
    `/catalogs/get-user-catalog-products/${payload.userId}?page=${payload.page}`
  );
  const categorizedObjects: (Catalog | Product)[] = response.data.map((obj) => {
    if (isCatalog(obj)) {
      return obj as Catalog;
    } else {
      return obj as Product;
    }
  });

  return categorizedObjects;
};

export const useGetAuthorProducts = (payload: {
  userId: number;
  page: number;
}) => {
  return useQuery("userProducts", () => getAuthorProducts(payload));
};
