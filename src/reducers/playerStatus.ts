/**
 * 播放器的状态
 *
 * 比如：显示/隐藏 检查信息
 */

import { Reducer } from "redux";
import { PlayerSeriesI } from "_components/Player/types/series";
import { ActionI } from "_types/core";

interface PlayerStatusStateI {
  showExamInfo: boolean; // 显示/隐藏检查信息
  showLeftPan: boolean; // 显示/隐藏左边栏
  showRightPan: boolean; // 显示/隐藏右边栏

  /** modes */
  movingMode: boolean; // 移动模式
  scaleMode: boolean; // 缩放模式
  wwwcMode: boolean; // 调窗模式

  keyName: string; // 当前的按键名称
}

/** actions types */
export enum PlayerStatusActionE {
  CLEAR_MODE = "clear_mode", // 清除所有模式

  SHOW_EXAM_INFO = "show_exam_info", // 显示检查信息
  HIDDEN_EXAM_INFO = "hidden_exam_info", // 隐藏检查信息

  SHOW_LEFT_PAN = "show_left_pan", // 显示左边栏
  HIDDEN_LEFT_PAN = "hidden_left_pan", // 隐藏左边栏

  SHOW_RIGHT_PAN = "show_right_pan", // 显示左边栏
  HIDDEN_RIGHT_PAN = "hidden_right_pan", // 隐藏左边栏

  ENABLE_MOVING_MODE = "enabled_moving_mode", // 启用移动模式
  DISABLE_MOVING_MODE = "disabled_moving_mode", // 禁用移动模式

  ENABLE_SCALE_MODE = "enabled_scale_mode", // 启用缩放模式
  DISABLE_SCALE_MODE = "disabled_scale_mode", // 禁用缩放模式

  ENABLE_WWWC_MODE = "enabled_wwwc_mode", // 启用调窗模式
  DISABLE_WWWC_MODE = "disabled_wwwc_mode", // 禁用调窗模式

  UPDATE_KEYNAME = "update_keyname", // 更新按键名称
}

/** payload types */
type SwitchExamInfoPayloadT = boolean | PlayerSeriesI;

const DEFAULT_STATE: PlayerStatusStateI = {
  showExamInfo: true,
  showLeftPan: true,
  showRightPan: false,
  movingMode: false,
  scaleMode: false,
  wwwcMode: false,
  keyName: "",
};

const {
  CLEAR_MODE,

  SHOW_EXAM_INFO,

  SHOW_LEFT_PAN,
  HIDDEN_LEFT_PAN,

  SHOW_RIGHT_PAN,
  HIDDEN_RIGHT_PAN,

  ENABLE_MOVING_MODE,
  DISABLE_MOVING_MODE,

  ENABLE_SCALE_MODE,
  DISABLE_SCALE_MODE,

  ENABLE_WWWC_MODE,
  DISABLE_WWWC_MODE,

  UPDATE_KEYNAME,
} = PlayerStatusActionE;

const playerStatusReducer: Reducer<
  PlayerStatusStateI,
  ActionI<PlayerStatusActionE, SwitchExamInfoPayloadT>
> = (state = DEFAULT_STATE, actions) => {
  const { type, payload } = actions;

  const update = (key: string, value: any): PlayerStatusStateI =>
    Object.assign({}, state, { [key]: value });
  const open = (key: string) => update(key, true);
  const close = (key: string) => update(key, false);
  const disabledAllMode = () => ({
    movingMode: false,
    scaleMode: false,
    wwwcMode: false,
  });

  const switchMode = (key: string, status: boolean) => {
    const res = disabledAllMode();
    return Object.assign({}, state, res, { [key]: status });
  };

  switch (type) {
    case CLEAR_MODE:
      return Object.assign({}, state, disabledAllMode());
    case SHOW_EXAM_INFO:
      if (typeof payload === "boolean") return Object.assign({}, state, { showExamInfo: payload });
      return state;

    case SHOW_LEFT_PAN:
      return open("showLeftPan");
    case HIDDEN_LEFT_PAN:
      return close("showLeftPan");

    case SHOW_RIGHT_PAN:
      return open("showRightPan");
    case HIDDEN_RIGHT_PAN:
      return close("showRightPan");

    case ENABLE_MOVING_MODE:
      return switchMode("movingMode", true);
    case DISABLE_MOVING_MODE:
      return switchMode("movingMode", false);

    case ENABLE_SCALE_MODE:
      return switchMode("scaleMode", true);
    case DISABLE_SCALE_MODE:
      return switchMode("scaleMode", false);
    case ENABLE_WWWC_MODE:
      return switchMode("wwwcMode", true);
    case DISABLE_WWWC_MODE:
      return switchMode("wwwcMode", false);

    case UPDATE_KEYNAME:
      return update("keyName", payload || "");

    default:
      return state;
  }
};

export default playerStatusReducer;
