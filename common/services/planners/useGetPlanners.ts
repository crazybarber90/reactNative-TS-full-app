import api from "../apiConfig";
import nodeModuleImports from "../imports";
import { Planner } from "../models";
const { useQuery, AsyncStorage, useQueries } = nodeModuleImports;

// api poziv, funkcija koju pozivamo ka backendu
// prima user_id: objekat, {user_id: number} je tip za argument koji prima funkcija
// vraca nam niz planera
const getPlanners = async (): Promise<Planner[] | null> => {
  const userData = await AsyncStorage.getItem("user");

  if (userData) {
    const { id } = JSON.parse(userData);

    const user_id = {
      user_id: id,
    };

    let filters: string = "";
    Object.entries(user_id).map((filter) => {
      if (filters) {
        filters = `${filters}&filter[${filter[0]}]=${filter[1]}`;
      } else {
        filters = `?filter[${filter[0]}]=${filter[1]}`;
      }
    });

    const planners = await api.get(`/planners${filters}`);

    return planners.data;
  } else {
    return null;
  }
};

// custom hook useQuery-a koji pozivamo gde god nam treba,
// imamo sve planere na osnovu user_id,
// potrebno mu je proslediti: {user_id: number}

export const useGetPlanners = () => {
  return useQuery("allPlanners", () => getPlanners());
};
