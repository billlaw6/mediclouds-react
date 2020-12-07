import { Reducer } from "redux";
import { PlayerExamMapT, PlayerActionE } from "_components/Player/types";
import { SeriesListI } from "_types/api";
import { ActionI } from "_types/core";

interface PlayerStateI {
  cs?: any; // cornerstone
  cst?: any; // cornerstone tools
  csImgLoader?: any; // cornerstone WADO Image Loader
  playerExamMap?: PlayerExamMapT; // 检查映射集合
  examInfos?: SeriesListI[];
}

type PlayerPayloadT = any;

const { UPDATE_PLAYER, INIT_PLAYER, UPDATE_PLAYER_EXAM_MAP } = PlayerActionE;

const DEFAULT_STATE: PlayerStateI = {};

const playerReducer: Reducer<PlayerStateI, ActionI<PlayerActionE, PlayerPayloadT>> = (
  state = DEFAULT_STATE,
  actions,
) => {
  const { type, payload } = actions;

  console.log("render.", type);
  switch (type) {
    case UPDATE_PLAYER:
    case INIT_PLAYER:
      return payload ? Object.assign({}, state, payload) : state;
    case UPDATE_PLAYER_EXAM_MAP: {
      console.log("update player exam map", payload);
      if (!payload) return state;
      return Object.assign({}, state, { playerExamMap: payload });
    }
    default:
      return state;
  }
};

export default playerReducer;
