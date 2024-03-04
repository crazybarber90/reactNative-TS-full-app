import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

export interface EditPlannerProps {
  title: string;
  description: string;
  id: number;
}

const editPlanner = async (payload: EditPlannerProps) => {
  const body = {
    title: payload.title,
    description: payload.description,
  };

  const response = await api.post(
    `/planners/update-planner/${payload.id}`,
    body
  );

  return response;
};

export const useEditPlanner = () => {
  const client = useQueryClient();

  return useMutation((payload: EditPlannerProps) => editPlanner(payload), {
    onSuccess: () => client.invalidateQueries("allPlanners"),
  });
};
