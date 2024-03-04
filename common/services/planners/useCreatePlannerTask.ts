import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, useQueryClient } = nodeModuleImports;

export interface NewTaskProps {
  selectedPlanner: string | number;
  title: string;
  category_id: string | number;
  remark: string;
  imageData: string;
  scheduled_date: string;
  scheduled_time: string;
  address: string;
  country: string;
  city: string;
  contact_phone: string;
  contact_email: string;
  price: string;
  currency_id: string;
}

const addNewTask = async (payload: NewTaskProps) => {
  const data = {
    ...payload,
    scheduled_date: `${payload.scheduled_date} ${payload.scheduled_time}:00`,
  };

  const response = await api.post(
    `/planner-items/create-planner-task/${payload.selectedPlanner}`,
    data
  );

  return response.data;
};

export const useCreatePlannerTask = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: NewTaskProps) => addNewTask(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries("plannerItems");
      queryClient.invalidateQueries("allPlanners");
    },
  });
};
