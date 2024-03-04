import api from "../apiConfig";
import nodeModuleImports from "../imports";
const { useQuery } = nodeModuleImports;

interface LanguageProps {
  country_iso_code: "en" | "sr";
  id: number;
  name: string;
}

const getLanguage = async () => {
  const data = await api.get<Promise<LanguageProps>>(
    "/licences/get-language-id"
  );
  return data.data;
};

export const useGetLanguage = () => {
  return useQuery("language", () => getLanguage());
};
