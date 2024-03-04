import api from "../apiConfig";
import nodeModuleImports from "../imports";
import { Licence } from "../models";
const { useQuery } = nodeModuleImports;

const getLicenceDetails = async (): Promise<Licence> => {
  const payload = ["terms_and_conditions", "sign_in_msg", "register_msg"];

  let expands = "";
  if (payload) {
    payload.map((expand) => {
      if (expands) {
        expands = `${expands},${expand}`;
      } else {
        expands = `?expand=${expand}`;
      }
    });
  }

  const response = await api.get<Licence>(
    `/licences/get-licence-details${expands}`
  );
  return response.data;
};

export const useGetLicenceDetails = () => {
  return useQuery("licenceDetails", () => getLicenceDetails());
};
