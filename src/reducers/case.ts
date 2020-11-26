import { Reducer } from "redux";
import { SearchQueryResI } from "_types/api";
import { ActionI } from "_types/core";
import { CaseActionE, CaseI } from "_types/case";

interface CaseStateI {
  // mineList?: SearchQueryResI<CaseI>;
  mineList?: CaseI[];
  // readRecordList?: SearchQueryResI<CaseI>;
  readRecordList?: CaseI[];
  current?: CaseI;
}

const cases: Reducer<CaseStateI, ActionI<CaseActionE, SearchQueryResI<CaseI> | CaseI>> = (
  state = {},
  actions,
) => {
  const { type, payload } = actions;

  switch (type) {
    case CaseActionE.GET_MINE_LIST: {
      if (payload) return Object.assign({}, state, { mineList: payload });
      return state;
    }
    case CaseActionE.GET_READ_RECORD_LIST: {
      if (payload) return Object.assign({}, state, { readRecordList: payload });
      return state;
    }
    case CaseActionE.SELECT_CASE: {
      if (payload)
        return Object.assign({}, state, {
          current: payload,
        });
      return state;
    }
    default:
      return state;
  }
};

export default cases;
