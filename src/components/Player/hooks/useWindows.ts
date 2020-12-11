import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { PlayerWindowsActionE } from "../types/actions";
import { PlayerExamPropsI } from "../types/common";
import { PlayerExamMapT } from "../types/exam";
import { PlayerSeriesI } from "../types/series";
import { WindowI, WindowMapT } from "../types/window";
import useData from "./useData";
import useSettings from "./useSettings";

let timer = -1; // window 计时器

export default () => {
  const windows = useSelector<StoreStateI, StoreStateI["playerWindows"]>(
    (state) => state.playerWindows,
  );
  const dispatch = useDispatch();
  const { getPlayerSeriesById, updateSeries, getPlayerSeries, cs } = useData();
  const { defaultPlaySpeed } = useSettings();

  const { windowsMap } = windows;
  const { OPEN_WINDOW, UPDATE_WINDOW, UPDATE_WINDOWS } = PlayerWindowsActionE;

  const openWindow = (data?: WindowI): void => {
    dispatch({ type: OPEN_WINDOW, payload: data });
  };

  /** 获取当前焦点的窗口 */
  const getFocusWindow = (): WindowI | undefined => {
    if (!windowsMap) return;

    for (const val of windowsMap.values()) {
      if (val.isFocus) return val;
    }
  };

  /**
   * 还原 【当前焦点窗口】 或 【指定窗口】
   *  的图像到初始状态
   *
   * */
  const resetWindowImage = (win?: WindowI): void => {
    if (!cs) return;

    const currentWindow = win || getFocusWindow();
    if (!currentWindow || !currentWindow.element) return;

    cs.reset(currentWindow.element);
  };

  /**
   * 更新除了data（PlayerSeries）以外其他字段
   * @param key win key
   * @param winData win data, except [data]
   */
  const updateWindow = (key: number, winData: any): void => {
    if (!windowsMap) return;
    const currentWindow = windowsMap.get(key);
    if (!currentWindow) return;

    dispatch({
      type: UPDATE_WINDOW,
      payload: Object.assign({}, currentWindow, winData),
    });
  };

  /** 更新窗口的 playerSeries
   * 并且将 win内的frame更新到 ExamMap 内的相应 PlayerSeries
   */
  const updateWindowSeries = (key: number, series: PlayerSeriesI): void => {
    if (!windowsMap) return;
    const currentWindow = windowsMap.get(key);
    if (!currentWindow) return;
    const { frame: windowFrame, data: currentSeries, element } = currentWindow;
    if (!currentSeries) return;

    if (element) element.hidden = true;

    const nextWindow = Object.assign({}, currentWindow, { data: series, frame: series.frame });

    const { examKey, key: seriesKey } = currentSeries;
    // /** 更新窗口内的series 将窗口的frame值赋给它 */
    updateSeries(examKey, seriesKey, { frame: windowFrame });

    resetWindowImage();

    dispatch({
      type: UPDATE_WINDOW,
      payload: nextWindow,
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

  const getPlayerSeriesByWindow = (win?: WindowI): PlayerSeriesI | undefined => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow) return;
    return currentWindow.data;
  };

  const pause = (win?: WindowI): void => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow || !currentWindow.isPlay) return;

    window.clearInterval(timer);
    currentWindow.isPlay = false;

    dispatch({ type: UPDATE_WINDOW, payload: currentWindow });
  };

  const next = (win?: WindowI): void => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow) return;
    const { frame: frameInWindow = 0, data: playerSeries, isPlay } = currentWindow;
    if (!playerSeries) return;
    const { cache = [] } = playerSeries;
    const nextFrame = Math.min(cache.length - 1, frameInWindow + 1);
    const nextWin: any = { frame: nextFrame };
    if (isPlay && nextFrame >= cache.length - 1) pause(currentWindow);

    updateWindow(currentWindow.key, nextWin);
  };

  const play = (): void => {
    const currentWindow = getFocusWindow();
    if (!currentWindow) return;

    const { data: playerSeries, frame } = currentWindow;
    let displayFrameRate = defaultPlaySpeed;

    if (playerSeries) {
      const { display_frame_rate, cache } = playerSeries;

      if (display_frame_rate) displayFrameRate = display_frame_rate;
      if (cache && frame >= cache.length - 1) currentWindow.frame = 0;
    }

    timer = window.setInterval(() => next(), displayFrameRate);
    currentWindow.isPlay = true;

    dispatch({ type: UPDATE_WINDOW, payload: currentWindow });
  };

  const prev = (win?: WindowI): void => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow) return;
    const { frame: frameInWindow = 0, data: playerSeries, isPlay } = currentWindow;
    if (!playerSeries) return;
    const nextFrame = Math.max(0, frameInWindow - 1);

    if (isPlay) pause(currentWindow);
    updateWindow(currentWindow.key, { frame: nextFrame });
  };

  const nextSeries = (win?: WindowI): void => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow) return;
    const { isPlay } = currentWindow;
    const currentSeries = getPlayerSeriesByWindow(currentWindow);
    if (!currentSeries) return;
    const _nextSeries = getPlayerSeries(currentSeries.examKey, currentSeries.key + 1);
    if (!_nextSeries) return;

    if (isPlay) pause(currentWindow);
    updateWindowSeries(currentWindow.key, _nextSeries);
  };

  const prevSeries = (win?: WindowI): void => {
    const currentWindow = win || getFocusWindow();
    if (!currentWindow) return;
    const { isPlay } = currentWindow;
    const currentSeries = getPlayerSeriesByWindow(currentWindow);
    if (!currentSeries) return;
    const _nextSeries = getPlayerSeries(currentSeries.examKey, currentSeries.key - 1);
    if (!_nextSeries) return;

    if (isPlay) pause(currentWindow);
    updateWindowSeries(currentWindow.key, _nextSeries);
  };

  return {
    ...windows,
    openWindow,
    updateWindow,
    updateWindowSeries,
    updateWins,
    getCurrentWindows,
    initWindows,
    getFocusWindow,
    getPlayerSeriesByWindow,
    focusWindow,
    play,
    pause,
    next,
    prev,
    nextSeries,
    prevSeries,
    resetWindowImage,
  };
};
