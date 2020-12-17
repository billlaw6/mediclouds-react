/**
 * 播放器的状态
 *
 * 比如：显示/隐藏 检查信息
 */

import { Reducer } from "redux";
import { CstToolNameT } from "_components/Player/types/common";
import { PlayerSeriesI } from "_components/Player/types/series";
import { ActionI } from "_types/core";

interface UpdateToolNamePayload {
  name: string;
  mouseNum: number;
}

/** payload types */
type SwitchExamInfoPayloadT = boolean | PlayerSeriesI | UpdateToolNamePayload;

interface PlayerStatusStateI {
  showExamInfo: boolean; // 显示/隐藏检查信息
  showLeftPan: boolean; // 显示/隐藏左边栏
  showRightPan: boolean; // 显示/隐藏右边栏

  /** modes */
  // movingMode: boolean; // 移动模式
  // scaleMode: boolean; // 缩放模式
  // wwwcMode: boolean; // 调窗模式

  keyName: string; // 当前的按键名称
  mouseNum: number; // 当前按下的鼠标按钮

  /** 功能 */
  // measureLength: boolean; // 长度测量功能

  currentToolName: CstToolNameT; // 当前的tool名
}

/** actions types */
export enum PlayerStatusActionE {
  CLEAR = "player_status_clear", // 清除所有状态

  CLEAR_MODE = "clear_mode", // 清除所有模式

  SWITCH_EXAM_INFO = "switch_exam_info", // 显示/隐藏检查信息

  SHOW_LEFT_PAN = "show_left_pan", // 显示左边栏
  HIDDEN_LEFT_PAN = "hidden_left_pan", // 隐藏左边栏

  SHOW_RIGHT_PAN = "show_right_pan", // 显示左边栏
  HIDDEN_RIGHT_PAN = "hidden_right_pan", // 隐藏左边栏

  UPDATE_KEYNAME = "update_keyname", // 更新按键名称
  UPDATE_MOUSE_NUM = "update_mouse_num", // 更新鼠标按下的按钮

  UPDATE_CURRENT_TOOL = "update_current_tool", // 更新当前使用的工具名称
}

const DEFAULT_STATE: PlayerStatusStateI = {
  showExamInfo: true,
  showLeftPan: true,
  showRightPan: false,
  keyName: "",
  mouseNum: 0,
  currentToolName: "",
};

const {
  CLEAR,

  CLEAR_MODE,

  SWITCH_EXAM_INFO,

  SHOW_LEFT_PAN,
  HIDDEN_LEFT_PAN,

  SHOW_RIGHT_PAN,
  HIDDEN_RIGHT_PAN,

  UPDATE_KEYNAME,
  UPDATE_MOUSE_NUM,

  UPDATE_CURRENT_TOOL,
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
    measureLength: false,
  });

  const switchMode = (key: string, status: boolean) => {
    const res = disabledAllMode();
    return Object.assign({}, state, res, { [key]: status });
  };

  switch (type) {
    case CLEAR:
      return DEFAULT_STATE;
    case CLEAR_MODE:
      return Object.assign({}, state, disabledAllMode());
    case SWITCH_EXAM_INFO:
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

    // case ENABLE_MOVING_MODE:
    //   return switchMode("movingMode", true);
    // case DISABLE_MOVING_MODE:
    //   return switchMode("movingMode", false);

    // case ENABLE_SCALE_MODE:
    //   return switchMode("scaleMode", true);
    // case DISABLE_SCALE_MODE:
    //   return switchMode("scaleMode", false);
    // case ENABLE_WWWC_MODE:
    //   return switchMode("wwwcMode", true);
    // case DISABLE_WWWC_MODE:
    //   return switchMode("wwwcMode", false);

    case UPDATE_KEYNAME:
      return update("keyName", payload || "");
    case UPDATE_MOUSE_NUM:
      return update("mouseNum", payload || 0);

    // case ENABLE_MEASURE_LENGTH:
    //   return switchMode("measureLength", true);
    // case DISABLE_MEASURE_LENGTH:
    //   return switchMode("measureLength", false);

    case UPDATE_CURRENT_TOOL:
      return update("currentToolName", payload || "");
    default:
      return state;
  }
};

export default playerStatusReducer;
