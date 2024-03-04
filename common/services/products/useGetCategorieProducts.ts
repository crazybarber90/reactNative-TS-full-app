import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;
import { Product, Catalog } from "./types";

// type MixedObject = Catalog | Product;

export function isCatalog(object: Catalog | Product): object is Catalog {
  return "is_catalog" in object;
}

const getCategorieProducts = async (payload: {
  category_id: number;
  page: number;
}): Promise<(Catalog | Product)[]> => {
  const response = await api.get<(Catalog | Product)[]>(
    `/categories/get-category-catalog-product/${payload.category_id}?page=${payload.page}`
  );

  const categorizedObjects: (Catalog | Product)[] = response.data.map((obj) => {
    if (isCatalog(obj)) {
      // Object has catalogProperty, so it's a Catalog object
      return obj as Catalog;
    } else {
      // Object doesn't have catalogProperty, so it's a Product object
      return obj as Product;
    }
  });

  return categorizedObjects;
};

export const useGetCategorieProducts = (payload: {
  category_id: number;
  page: number;
}) => {
  return useQuery("getCategorieProducts", () => getCategorieProducts(payload), {
    refetchOnWindowFocus: true,
  });
};
