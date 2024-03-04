import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;
import { Author } from "./types";

// const getAuthorData = async (id: number): Promise<Author> => {
//   const response = await api.get<Author[]>(
//     `/profiles?filter[user_id]=${id}&expand=locations`
//   );

//   console.log(response, "response data");

//   return response.data[0];
// };

// export const useGetAuthorData = (id: number) => {
//   return useQuery("authorData", () => getAuthorData(id));
// };

const getAuthorData = async (username: string): Promise<Author> => {
  const response = await api.get<Author[]>(
    `/profiles?filter[username]=${username}&expand=locations`
  );

  return response.data[0];
};

export const useGetAuthorData = (username: string) => {
  return useQuery("authorData", () => getAuthorData(username));
};
