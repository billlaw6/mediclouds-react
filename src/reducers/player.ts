import { Reducer } from "redux";
import { CollectionMapT, PlayerActionE } from "_components/Player/types";
import { SeriesListI } from "_types/api";
import { ActionI } from "_types/core";

interface PlayerStateI {
  cs?: any; // cornerstone
  cst?: any; // cornerstone tools
  csImgLoader?: any; // cornerstone WADO Image Loader
  collectionMap?: CollectionMapT; // 检查映射集合
  examInfos?: SeriesListI[];
}

type PlayerPayloadT = any;

const { INIT_CS, INIT_CST, INIT_CS_IMGLOADER, UPDATE_COLLECTION_MAP } = PlayerActionE;

const DEFAULT_STATE: PlayerStateI = {};

const playerReducer: Reducer<PlayerStateI, ActionI<PlayerActionE, PlayerPayloadT>> = (
  state = DEFAULT_STATE,
  actions,
) => {
  const { type, payload } = actions;

  switch (type) {
    case INIT_CS:
      return Object.assign({}, state, { cs: payload });
    case INIT_CST:
      return Object.assign({}, state, { cst: payload });
    case INIT_CS_IMGLOADER:
      return Object.assign({}, state, { csImgLoader: payload });
    case UPDATE_COLLECTION_MAP: {
      if (!payload) return state;
      return Object.assign({}, state, { collectionMap: payload });
    }
    default:
      return state;
  }
};

export default playerReducer;
