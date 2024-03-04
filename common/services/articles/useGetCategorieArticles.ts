import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;
import { Article } from "./types";

const getCategorieArticles = async (payload: {
  category_id: number;
  page: number;
}): Promise<Article[]> => {
  const response = await api.get<Article[]>(
    `/contents?filter[content_type_id]=2&filter[category_id]=${payload.category_id}&page=${payload.page}`
  );
  return response.data;
};

export const useGetCategorieArticles = (payload: {
  category_id: number;
  page: number;
}) => {
  return useQuery("getCategorieArticles", () => getCategorieArticles(payload));
};
