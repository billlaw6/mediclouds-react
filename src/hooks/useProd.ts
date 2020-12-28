import { useSelector } from "react-redux";
import { getProducts, ProdI } from "mc-api";
import { StoreStateI } from "_types/core";

export default () => {
  const prods = useSelector<StoreStateI, StoreStateI["prod"]>((state) => state.prod);
  const getProdList = async (): Promise<ProdI[]> => await getProducts();

  return { prods, getProdList };
};
