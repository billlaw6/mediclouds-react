import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { PlayerWindowsActionE } from "../types/actions";
import { PlayerExamPropsI } from "../types/common";
import { PlayerExamMapT } from "../types/exam";
import { WindowI, WindowKeyT, WindowMapT } from "../types/window";
import useData from "./useData";

export default () => {
  const windows = useSelector<StoreStateI, StoreStateI["playerWindows"]>(
    (state) => state.playerWindows,
  );
  const dispatch = useDispatch();
  const { getPlayerSeriesById } = useData();

  const { windowsMap } = windows;
  const { OPEN_WINDOW, UPDATE_WINDOW, UPDATE_WINDOWS } = PlayerWindowsActionE;

  const openWindow = (data?: WindowI): void => {
    dispatch({ type: OPEN_WINDOW, payload: data });
  };

  const updateWindow = (key: WindowKeyT, data: WindowI): void => {
    dispatch({
      type: UPDATE_WINDOW,
      payload: {
        key,
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

    dispatch({ type: UPDATE_WINDOWS, payload: windowsMap });
  };

  /** 获取当前已激活的所有窗口 */
  const getCurrentWindows = (): WindowMapT | undefined => {
    if (!windowsMap) return;
    const res: WindowMapT = new Map();

    windowsMap.forEach((win: WindowI, index) => {
      if (win.isActive) res.set(index, win);
    });

    return res;
  };

  const initWindows = (exams: PlayerExamPropsI[], examMaps: PlayerExamMapT): void => {
    const res: WindowMapT = new Map();
    const activeExams = exams.filter((item) => item.active);

    activeExams.forEach((exam, index) => {
      const { defaultFrame = 0, defaultSeriesId } = exam;
      const currentExam = examMaps.get(index);
      if (currentExam) {
        const series = getPlayerSeriesById(currentExam, defaultSeriesId || "");

        res.set(index, {
          key: index,
          data: series || currentExam.data.get(0),
          frame: defaultFrame,
          // isActive: true,
          isFocus: index ? false : true,
          isPlay: false,
        });
      }
    });

    dispatch({ type: UPDATE_WINDOWS, payload: res });
  };

  /** 获取当前焦点的窗口 */
  const getFocusWindow = (): WindowI | undefined => {
    if (!windowsMap) return;

    for (const val of windowsMap.values()) {
      if (val.isFocus) return val;
    }
  };

  /**
   * 将某个窗口聚焦
   * 同时将其他窗口失焦
   * 并返回是否成功的布尔值
   *
   * @param {number} key 需要聚焦窗口的key
   * @return {boolean}
   */
  const focusWindow = (key: number): boolean => {
    if (!windowsMap || typeof key !== "number") return false;

    windowsMap.forEach((item) => {
      if (item.key === key) item.isFocus = true;
      else item.isFocus = false;
    });

    dispatch({ type: UPDATE_WINDOWS, payload: windowsMap });

    return true;
  };

  return {
    ...windows,
    openWindow,
    updateWindow,
    updateWins,
    getCurrentWindows,
    initWindows,
    getFocusWindow,
    focusWindow,
  };
};
