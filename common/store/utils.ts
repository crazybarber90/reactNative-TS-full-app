import nodeModuleImports from "../services/imports";
import { Profile } from "../services/models";
const { AsyncStorage } = nodeModuleImports;

export const getStorageUser = async () => {
  try {
    return await AsyncStorage.getItem("user");
  } catch (e) {
    console.log(e);
  }
};

export const getStorageToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};
