/**
 * 播放器的状态
 *
 * 比如：显示/隐藏 检查信息
 */

import { Reducer } from "redux";
import { DataI } from "_components/Player/types";
import { ActionI } from "_types/core";

interface PlayerStatusStateI {
  showExamInfo: boolean; // 显示检查信息
  enabledViewport: boolean; // 是否激活了显示窗口
  isPlay: boolean; // 是否在播放
}

/** actions types */
export enum PlayerStatusActionE {
  SHOW_EXAM_INFO = "show_exam_info", // 显示/隐藏检查信息

  ENABLE_VIEWPORT = "enable_viewport", // 激活显示窗口
  DISABLED_VIEWPORT = "disabled_viewport", // 禁用显示窗口

  PLAY = "play", // 播放
  PAUSE = "pause", // 暂停
}

/** payload types */
type SwitchExamInfoPayloadT = boolean | DataI;

const DEFAULT_STATE: PlayerStatusStateI = {
  showExamInfo: true,
  enabledViewport: false,
  isPlay: false,
};

const { SHOW_EXAM_INFO, ENABLE_VIEWPORT, DISABLED_VIEWPORT, PLAY, PAUSE } = PlayerStatusActionE;

const playerStatusReducer: Reducer<
  PlayerStatusStateI,
  ActionI<PlayerStatusActionE, SwitchExamInfoPayloadT>
> = (state = DEFAULT_STATE, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case SHOW_EXAM_INFO:
      if (typeof payload === "boolean") return Object.assign({}, state, { showExamInfo: payload });
      return state;

    case ENABLE_VIEWPORT:
      return Object.assign({}, state, { enabledViewport: true });
    case DISABLED_VIEWPORT:
      return Object.assign({}, state, { enabledViewport: false });

    case PLAY:
      return Object.assign({}, state, { isPlay: true });
    case PAUSE:
      return Object.assign({}, state, { isPlay: false });
    default:
      return state;
  }
};

export default playerStatusReducer;
