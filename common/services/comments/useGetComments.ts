import api from "../apiConfig";
import { Comments } from "./types";

import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;

const getComments = async (contentId: number): Promise<Comments[]> => {
  const comments = await api.get<Comments[]>(
    `/comments?filter[status]=approved&filter[content_id]=${contentId}`
  );
  return comments.data;
};
export const useGetComments = (contentId: number) => {
  return useQuery("comments", () => getComments(contentId));
};
