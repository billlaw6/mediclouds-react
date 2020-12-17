/**
 * 播放器的配置
 *
 */

import { Reducer } from "redux";
import { ActionI } from "_types/core";

// 监听键盘事件
// const LEFT = 37,
//   RIGHT = 39,
//   UP = 38,
//   DOWN = 40,
//   PLAY_PAUSE = 32,
//   MOVE = 17, // control
//   ZOOM_IN = 65, // A
//   ZOOM_OUT = 90, // Z
//   RESET = 82; // R

export enum PlayerActionE {
  UPDATE_SHORTCUT_KEY = "update_shortcut_key", // 更新快捷键
  RESET_SHORTCUT_KEY = "reset_shortcut_key", // 重制快捷键

  SWTICH_PLAYER_VERSION = "switch_player_version", // 切换播放器版本
}

interface UpdateShortCutKeyPayloadI {
  key: string;
  value: number;
}

interface PlayerSettingsStateI {
  zoomInKeyCode: number; // 放大快捷键
  zoomOutKeyCode: number; // 缩小快捷键
  nextFrameKeyCode: number; // 下一帧快捷键
  prevFrameKeyCode: number; // 上一帧快捷键
  nextSeriesKeyCode: number; // 下一序列快捷键
  prevSeriesKeyCode: number; // 下一序列快捷键
  playAndPauseKeyCode: number; // 播放/暂停快捷键
  moveKeyCode: number; // 移动快捷键
  resetKeyCode: number; // 重制快捷键
  defaultPlaySpeed: number; // 播放速度 ms

  isNewPlayer: boolean; // 是否为新版播放器
}

const DEFAULT_SHORTCUT_KEY = {
  zoomInKeyCode: 65,
  zoomOutKeyCode: 90,
  nextFrameKeyCode: 39,
  prevFrameKeyCode: 37,
  nextSeriesKeyCode: 40,
  prevSeriesKeyCode: 38,
  playAndPauseKeyCode: 32,
  moveKeyCode: 17,
  resetKeyCode: 82,
  defaultPlaySpeed: 120,

  isNewPlayer: true,
};

const DEFAULT_STATE: PlayerSettingsStateI = {
  ...DEFAULT_SHORTCUT_KEY,
};

const playerSettingsReducer: Reducer<
  PlayerSettingsStateI,
  ActionI<PlayerActionE, UpdateShortCutKeyPayloadI>
> = (state = DEFAULT_STATE, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case PlayerActionE.RESET_SHORTCUT_KEY:
      return Object.assign({}, state, { ...DEFAULT_SHORTCUT_KEY });
    case PlayerActionE.UPDATE_SHORTCUT_KEY: {
      if (!payload) return state;
      const { key, value } = payload as UpdateShortCutKeyPayloadI;
      return Object.assign({}, state, { [key]: value });
    }
    case PlayerActionE.SWTICH_PLAYER_VERSION:
      return Object.assign({}, state, { isNewPlayer: !!payload });
    default:
      return state;
  }
};

export default playerSettingsReducer;
