import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "_api/product";
import { StoreStateI } from "_types/core";
import { ProdI } from "_types/product";

export default () => {
  const prods = useSelector<StoreStateI, StoreStateI["prod"]>((state) => state.prod);
  const getProdList = async (): Promise<ProdI[]> => await getProducts();

  return { prods, getProdList };
};
