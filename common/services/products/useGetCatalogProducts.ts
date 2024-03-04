import api from "../apiConfig";
import nodeModuleImports from "../imports";
import { Product } from "./types";
const { useQuery } = nodeModuleImports;

const getCatalogProducts = async (payload: {
  catalogId: number;
  page: number;
}): Promise<Product[]> => {
  const response = await api.get<Product[]>(
    `/catalogs/get-catalog-products/${payload.catalogId}?page=${payload.page}`
  );

  return response.data;
};

export const useGetCatalogProducts = (payload: {
  catalogId: number;
  page: number;
}) => {
  return useQuery("catalog-products", () => getCatalogProducts(payload));
};
