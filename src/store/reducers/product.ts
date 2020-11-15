import { Reducer } from "redux";
import { ProdI, ProdActionE, ProdStateT } from "_types/product";
import { ActionI } from "_types/core";

const DEFAULT_STATE: ProdStateT = [];

const aiReport: Reducer<ProdI[], ActionI<ProdActionE, string[] | ProdI[]>> = (
  state = DEFAULT_STATE,
  action,
): ProdStateT => {
  const { type, payload } = action;

  switch (type) {
    case ProdActionE.GET_LIST:
      if (payload) return payload as ProdI[];
      return state;
    default:
      return state;
  }
};

export default aiReport;
