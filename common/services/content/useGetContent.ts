import api from "../apiConfig";

import nodeModuleImports from "../imports";
import { SingleContent } from "../models";
const { useQuery } = nodeModuleImports;

const getContent = async (): Promise<SingleContent[]> => {
  const content = await api.get<SingleContent[]>(
    `/licence-content-type-options`
  );

  let poroducts: SingleContent | null = null;
  let articles: SingleContent | null = null;
  let blogs: SingleContent | null = null;

  content.data.map((cont) => {
    switch (cont.content_type_id) {
      case 1:
        poroducts = cont;
        break;
      case 2:
        articles = cont;
        break;
      case 3:
        blogs = cont;
        break;
      default:
        break;
    }
  });

  let contOrder: SingleContent[] = [];
  if (poroducts) {
    contOrder.push(poroducts);
  }
  if (articles) {
    contOrder.push(articles);
  }
  if (blogs) {
    contOrder.push(blogs);
  }

  return contOrder;
};

export const useGetContent = () => {
  return useQuery("contentData", () => getContent());
};
