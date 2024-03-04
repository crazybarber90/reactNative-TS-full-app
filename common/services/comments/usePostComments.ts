import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation } = nodeModuleImports;
import { CommentDataTypes } from "../../../plantsShop/screens/SingleScreens/SingleProduct";
import { SuccessPostComment } from "./types";

const postComment = async (
  commentData: CommentDataTypes
): Promise<SuccessPostComment> => {
  const response = await api.post(
    `/comments/post-comment/${commentData.singleContentId}`,
    commentData
  );
  return response.data;
};

export const usePostComment = () => {
  return useMutation((commentData: CommentDataTypes) =>
    postComment(commentData)
  );
};
