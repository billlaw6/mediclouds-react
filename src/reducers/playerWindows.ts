import { Reducer } from "redux";
import { PlayerWindowsActionE } from "_components/Player/types/actions";
import { WindowMapT, WindowI } from "_components/Player/types/window";
import { ActionI } from "_types/core";

interface PlayerWindowsStateI {
  windowsMap?: WindowMapT;
}

const DEFAULT: PlayerWindowsStateI = {};

const {
  CLEAR,
  OPEN_WINDOW,
  UPDATE_WINDOW,
  COLSE_WINDOW,
  ACTIVE_WINDOW,
  UPDATE_WINDOWS,
} = PlayerWindowsActionE;

const playerWindowsReducer: Reducer<
  PlayerWindowsStateI,
  ActionI<PlayerWindowsActionE, WindowMapT | WindowI | WindowI[] | number>
> = (state = DEFAULT, actions) => {
  const { type, payload } = actions;

  switch (type) {
    case CLEAR:
      return DEFAULT;
    case OPEN_WINDOW: {
      const nextWindowMap = state.windowsMap || new Map();
      if (payload) nextWindowMap.set(nextWindowMap.size, payload);
      else nextWindowMap.set(nextWindowMap.size, { active: true });

      return Object.assign({}, state, {
        windowsMap: nextWindowMap,
      });
    }
    case UPDATE_WINDOWS: {
      if (!payload) return state;

      return Object.assign({}, state, {
        windowsMap: payload,
      });
    }
    case UPDATE_WINDOW: {
      const { windowsMap } = state;
      if (!payload || !windowsMap) return state;
      const { key } = payload as WindowI;
      windowsMap.set(key, payload as WindowI);

      return Object.assign({}, state, {
        windowsMap,
      });
    }
    case ACTIVE_WINDOW: {
      const { windowsMap } = state;
      if (typeof payload !== "number" || !windowsMap) return state;

      windowsMap.forEach((item, index) => {
        if (index === payload) item.isActive = true;
        else item.isActive = false;
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
