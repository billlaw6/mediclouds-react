import { Reducer } from "redux";
import { PlayerActionE } from "_components/Player/types/actions";
import { PlayerExamMapT } from "_components/Player/types/exam";
import { SeriesListI } from "_types/api";
import { ActionI } from "_types/core";
import { ExamIndexI } from "_types/resources";

interface PlayerStateI {
  cs?: any; // cornerstone
  cst?: any; // cornerstone tools
  csImgLoader?: any; // cornerstone WADO Image Loader
  playerExamMap?: PlayerExamMapT; // 检查映射集合
  examList?: ExamIndexI[]; // 原始检查数据数组
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

  switch (type) {
    case UPDATE_PLAYER:
    case INIT_PLAYER:
      return payload ? Object.assign({}, state, payload) : state;
    case UPDATE_PLAYER_EXAM_MAP: {
      if (!payload) return state;
      return Object.assign({}, state, { playerExamMap: payload });
    }
    default:
      return state;
  }
};

export default playerReducer;
