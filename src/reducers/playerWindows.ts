import { Reducer } from "redux";
import { isUndefined } from "util";
import { PlayerWindowsActionE, WindowI, WindowMapT } from "_components/Player/types";
import { ActionI } from "_types/core";

interface PlayerWindowsStateI {
  windowsMap?: WindowMapT;
}

interface UpdateWindowPayloadI {
  index: number;
  data: WindowI;
}

const DEFAULT: PlayerWindowsStateI = {};

const { OPEN_WINDOW, UPDATE_WINDOW, COLSE_WINDOW, ACTIVE_WINDOW, UPDATE } = PlayerWindowsActionE;

const playerWindowsReducer: Reducer<
  PlayerWindowsStateI,
  ActionI<PlayerWindowsActionE, WindowMapT | WindowI | WindowI[] | UpdateWindowPayloadI | number>
> = (state = DEFAULT, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case OPEN_WINDOW: {
      const nextWindowMap = state.windowsMap || new Map();
      if (payload) nextWindowMap.set(nextWindowMap.size, payload);
      else nextWindowMap.set(nextWindowMap.size, { active: true });

      return Object.assign({}, state, {
        windowsMap: nextWindowMap,
      });
    }
    case UPDATE: {
      if (!payload) return state;

      return Object.assign({}, state, {
        windowsMap: payload,
      });
    }
    case UPDATE_WINDOW: {
      const { windowsMap } = state;
      if (!payload || !windowsMap) return state;
      const { index, data } = payload as UpdateWindowPayloadI;
      windowsMap.set(index, data);

      return Object.assign({}, state, {
        windowsMap,
      });
    }
    case ACTIVE_WINDOW: {
      const { windowsMap } = state;
      if (typeof payload !== "number" || !windowsMap) return state;

      windowsMap.forEach((item, index) => {
        if (index === payload) item.active = true;
        else item.active = false;
      });

      return Object.assign({}, state, {
        windowsMap,
      });
    }
    default:
      return state;
  }
};

export default playerWindowsReducer;
