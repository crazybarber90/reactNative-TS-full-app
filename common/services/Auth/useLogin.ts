import { Credentials, Profile } from "../models";
import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useMutation, AsyncStorage } = nodeModuleImports;

const login = async (credentials: Credentials): Promise<Profile> => {
  const response = await api.post(
    `/users/login-app-front-user-free-licence`,
    credentials
  );
  if (response.data.auth_key) {
    await AsyncStorage.setItem("token", response.data.auth_key);
    await AsyncStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const useLogin = () => {
  return useMutation((request: Credentials) => login(request), {
    onSuccess: () => console.log("RADIIIIII"),
    onError: () => console.log("NE RADIIIIIIIIIIIIIII"),
    // ...options,
  });
};
