import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { PlayerWindowsActionE, WindowI, WindowMapT } from "../types";

export default () => {
  const windows = useSelector<StoreStateI, StoreStateI["playerWindows"]>(
    (state) => state.playerWindows,
  );
  const dispatch = useDispatch();

  const { windowsMap } = windows;
  const { OPEN_WINDOW, UPDATE_WINDOW, UPDATE } = PlayerWindowsActionE;

  const openWindow = (data?: WindowI): void => {
    dispatch({ type: OPEN_WINDOW, payload: data });
  };

  const updateWindow = (index: number, data: WindowI): void => {
    dispatch({
      type: UPDATE_WINDOW,
      payload: {
        index,
        data,
      },
    });
  };

  /** 增量更新相对应的窗口 */
  const updateWins = (data: WindowMapT | WindowI[]): void => {
    if (!windowsMap) return;

    data.forEach((win: WindowI, index: number) => {
      windowsMap.set(index, win);
    });

    dispatch({ type: UPDATE, payload: windowsMap });
  };

  /** 获取当前已激活的所有窗口 */
  const getCurrentWindows = (): WindowMapT | undefined => {
    if (!windowsMap) return;
    const res: WindowMapT = new Map();

    windowsMap.forEach((win, index) => {
      if (win.active) res.set(index, win);
    });

    return res;
  };

  return { ...windows, openWindow, updateWindow, updateWins, getCurrentWindows };
};
