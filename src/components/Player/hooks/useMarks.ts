import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { PlayerMarkI, PlayerMarksActionE, PlayerMarksI } from "../types/marks";
import useData from "./useData";
import useWindows from "./useWindows";

export default () => {
  const marks = useSelector<StoreStateI, StoreStateI["playerMarks"]>((state) => state.playerMarks);
  const dispatch = useDispatch();
  const { cs, cst, getPlayerSeries } = useData();
  const { getFocusWindow, updateWin, windowsMap } = useWindows();

  const getState = (toolName: string) => marks[toolName];

  const addMark = (toolName: string, data: any): void => {
    const currentWindow = getFocusWindow();
    if (!currentWindow) return;
    const { data: playerSeries, frame } = currentWindow;
    if (!playerSeries) return;
    const { examKey, key } = playerSeries;

    dispatch({
      type: PlayerMarksActionE.ADD_MARK,
      payload: {
        toolName,
        data: {
          examKey,
          seriesKey: key,
          frame,
          data,
        },
      },
    });
  };

  const delMark = (toolName: string, toolStateData: any): void => {
    if (!cst || !cs) return;
    const currentWindow = getFocusWindow();
    if (!currentWindow) return;
    const { element, data: playerSeries } = currentWindow;
    if (!element || !playerSeries || !playerSeries.cache) return;

    cst.removeToolState(element, toolName, toolStateData);
    cs.updateImage(element);
    dispatch({
      type: PlayerMarksActionE.DEL_MARK,
      payload: {
        toolName,
        id: toolStateData.uuid,
      },
    });
  };

  const updateMarkByData = (toolName: string, toolStateData: any): void => {
    const { uuid } = toolStateData;
    const currentMarks = getState(toolName) || [];
    const currentMark = currentMarks.find((item) => item.data.uuid === uuid);
    if (!currentMark) return;

    dispatch({
      type: PlayerMarksActionE.UPDATE_MARK,
      payload: {
        toolName,
        nextMark: Object.assign({}, currentMark, {
          data: toolStateData,
        }),
      },
    });
  };

  const updateMark = (toolName: string, nextMark: PlayerMarkI): void => {
    dispatch({
      type: PlayerMarksActionE.UPDATE_MARK,
      payload: {
        toolName,
        nextMark,
      },
    });
  };

  const selectedMark = (toolName: string, mark: PlayerMarkI): void => {
    const currentWindow = getFocusWindow();
    if (!currentWindow) return;
    const { examKey, seriesKey, frame, data } = mark;
    const nextSeries = getPlayerSeries(examKey, seriesKey);
    if (!nextSeries) return;
    updateWin(currentWindow.key, {
      frame,
      isFocus: true,
      data: nextSeries,
    });
    dispatch({
      type: PlayerMarksActionE.ACTIVE_MARK,
      payload: {
        toolName,
        id: data.uuid,
      },
    });
  };

  const clearPlayerMarks = (): void => {
    dispatch({ type: PlayerMarksActionE.CLEAR });
  };

  return {
    Length: getState("Length"),
    addMark,
    delMark,
    updateMark,
    updateMarkByData,
    selectedMark,
    clearPlayerMarks,
  };
};
