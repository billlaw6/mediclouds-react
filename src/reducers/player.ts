import { Reducer } from "redux";
import { PlayerDataI, PlayerDataMapT } from "_components/Player/type";
import { PlayerActionE } from "_components/Player/types";
import { SeriesListI } from "_types/api";
import { ActionI } from "_types/core";

interface PlayerStateI {
  cs?: any; // cornerstone
  cst?: any; // cornerstone tools
  data?: PlayerDataMapT; // data数据组
  seriesIndex: number;
  examInfo?: SeriesListI;
}

interface UpdateDataItemPayloadI {
  index: number;
  value: PlayerDataI;
}

type PlayerPayloadT = any | UpdateDataItemPayloadI | number;

const {
  INIT_CS,
  INIT_CST,
  UPDATE,
  UPDATE_DATA_ITEM,
  UPDATE_DATA,
  UPDATE_SERIES_INDEX,
} = PlayerActionE;

const DEFAULT_STATE: PlayerStateI = {
  seriesIndex: 0,
};

const playerReducer: Reducer<PlayerStateI, ActionI<PlayerActionE, PlayerPayloadT>> = (
  state = DEFAULT_STATE,
  actions,
) => {
  const { data } = state;
  const { type, payload } = actions;

  switch (type) {
    case INIT_CS:
      return Object.assign({}, state, { cs: payload });
    case INIT_CST:
      return Object.assign({}, state, { cst: payload });
    case UPDATE: {
      if (!payload) return state;
      return Object.assign({}, state, payload);
    }
    case UPDATE_SERIES_INDEX: {
      if (typeof payload !== "number") return state;
      return Object.assign({}, state, { seriesIndex: payload });
    }
    case UPDATE_DATA:
      return Object.assign({}, state, { data: payload });
    case UPDATE_DATA_ITEM: {
      if (payload) {
        const { index, value } = payload as UpdateDataItemPayloadI;
        const nextData = data || new Map();
        nextData.set(index, value);

        return Object.assign({}, state, { data: nextData });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export default playerReducer;
