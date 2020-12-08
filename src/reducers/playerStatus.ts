/**
 * 播放器的状态
 *
 * 比如：显示/隐藏 检查信息
 */

import { Reducer } from "redux";
import { PlayerSeriesI } from "_components/Player/types/series";
import { ActionI } from "_types/core";

interface PlayerStatusStateI {
  showExamInfo: boolean; // 显示检查信息
  enabledViewport: boolean; // 是否激活了显示窗口
  isPlay: boolean; // 是否在播放
  showLeftPan: boolean; // 激活左边栏
  showRightPan: boolean; // 激活右边栏
}

/** actions types */
export enum PlayerStatusActionE {
  SHOW_EXAM_INFO = "show_exam_info", // 显示/隐藏检查信息

  ENABLE_VIEWPORT = "enable_viewport", // 激活显示窗口
  DISABLED_VIEWPORT = "disabled_viewport", // 禁用显示窗口

  PLAY = "play", // 播放
  PAUSE = "pause", // 暂停

  SHOW_LEFT_PAN = "show_left_pan", // 显示左边栏
  HIDDEN_LEFT_PAN = "hidden_left_pan", // 隐藏左边栏

  SHOW_RIGHT_PAN = "show_right_pan", // 显示左边栏
  HIDDEN_RIGHT_PAN = "hidden_right_pan", // 隐藏左边栏
}

/** payload types */
type SwitchExamInfoPayloadT = boolean | PlayerSeriesI;

const DEFAULT_STATE: PlayerStatusStateI = {
  showExamInfo: true,
  enabledViewport: false,
  isPlay: false,
  showLeftPan: false,
  showRightPan: false,
};

const {
  SHOW_EXAM_INFO,
  ENABLE_VIEWPORT,
  DISABLED_VIEWPORT,
  PLAY,
  PAUSE,
  SHOW_LEFT_PAN,
  HIDDEN_LEFT_PAN,
  SHOW_RIGHT_PAN,
  HIDDEN_RIGHT_PAN,
} = PlayerStatusActionE;

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

    case SHOW_LEFT_PAN:
      return Object.assign({}, state, { showLeftPan: true });
    case HIDDEN_LEFT_PAN:
      return Object.assign({}, state, { showLeftPan: false });

    case SHOW_RIGHT_PAN:
      return Object.assign({}, state, { showRightPan: true });
    case HIDDEN_RIGHT_PAN:
      return Object.assign({}, state, { showRightPan: false });

    default:
      return state;
  }
};

export default playerStatusReducer;
