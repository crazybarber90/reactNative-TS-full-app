import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;
import { Blog } from "../blogs/types";

const getAuthorBlogs = async (payload: {
  userId: number;
  page: number;
}): Promise<Blog[]> => {
  const response = await api.get<Blog[]>(
    `/contents?filter[author_id]=${payload.userId}&filter[status]=approved&filter[content_type_id]=3&page=${payload.page}`
  );
  return response.data;
};

export const useGetAuthorBlogs = (payload: {
  userId: number;
  page: number;
}) => {
  return useQuery("userBlogs", () => getAuthorBlogs(payload));
};
