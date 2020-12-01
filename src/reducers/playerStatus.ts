/**
 * 播放器的状态
 *
 * 比如：显示/隐藏 检查信息
 */

import { Reducer } from "redux";
import { PlayerDataI } from "_components/Player/type";
import { ActionI } from "_types/core";

interface PlayerStatusStateI {
  showExamInfo: boolean; // 显示检查信息
  enabledViewport: boolean; // 是否激活了显示窗口
}

/** actions types */
export enum PlayerStatusActionE {
  SHOW_EXAM_INFO = "show_exam_info", // 显示/隐藏检查信息
  ENABLE_VIEWPORT = "enable_viewport", // 激活显示窗口
  DISABLED_VIEWPORT = "disabled_viewport", // 禁用显示窗口
}

/** payload types */
type SwitchExamInfoPayloadT = boolean | PlayerDataI;

const DEFAULT_STATE: PlayerStatusStateI = {
  showExamInfo: true,
  enabledViewport: false,
};

const playerStatusReducer: Reducer<
  PlayerStatusStateI,
  ActionI<PlayerStatusActionE, SwitchExamInfoPayloadT>
> = (state = DEFAULT_STATE, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case PlayerStatusActionE.SHOW_EXAM_INFO:
      if (typeof payload === "boolean") return Object.assign({}, state, { showExamInfo: payload });
      return state;
    case PlayerStatusActionE.ENABLE_VIEWPORT:
      console.log("enabled");
      return Object.assign({}, state, { enabledViewport: true });
    case PlayerStatusActionE.DISABLED_VIEWPORT:
      return Object.assign({}, state, { enabledViewport: false });
    default:
      return state;
  }
};

export default playerStatusReducer;
