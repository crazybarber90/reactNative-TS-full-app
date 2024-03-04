import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation } = nodeModuleImports;

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

const register = async (credentials: RegisterCredentials) => {
  const response = await api.post(
    `/users/register-licence-front-user`,
    credentials
  );
  return response.data;
};

export const useRegister = () => {
  return useMutation((req: RegisterCredentials) => register(req), {
    onSuccess: (data) => {
      console.log("Radilo je! Odgovor je:", data);
    },
    onError: (error) => console.log("NE RADIIIIIIIIIIIIIII", error),
  });
};
