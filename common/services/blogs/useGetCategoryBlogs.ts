import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;
import { Blog } from "./types";

const getCategorieBlogs = async (payload: {
  category_id: number;
  page: number;
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>(
    `/contents?filter[content_type_id]=3&filter[category_id]=${payload.category_id}&page=${payload.page}`
  );
  return response.data;
};

export const useGetCategorieBlogs = (payload: {
  category_id: number;
  page: number;
}) => {
  return useQuery("getCategorieBlogs", () => getCategorieBlogs(payload));
};
