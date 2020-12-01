import { useDispatch, useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { PlayerDataI, PlayerDataMapT, PlayerStateI } from "../type";
import { PlayerActionE } from "../types";

const {
  INIT_CST,
  INIT_CS,
  UPDATE,
  UPDATE_DATA_ITEM,
  UPDATE_DATA,
  UPDATE_SERIES_INDEX,
} = PlayerActionE;

export default () => {
  const playerReducerData = useSelector<StoreStateI, StoreStateI["player"]>(
    (state) => state.player,
  );

  const dispaych = useDispatch();

  const getCurrentData = (): PlayerDataI | undefined => {
    const { seriesIndex = 0, data } = playerReducerData;

    if (!data) return;
    return data.get(seriesIndex);
  };

  const initCs = (cs: any): void => {
    dispaych({ type: INIT_CS, payload: cs });
  };
  const initCst = (cst: any): void => {
    dispaych({ type: INIT_CST, payload: cst });
  };

  const updateReducer = (data: any): void => {
    dispaych({
      type: UPDATE,
      payload: data,
    });
  };
  const updateData = (data: PlayerDataMapT): void => {
    dispaych({
      type: UPDATE_DATA,
      payload: data,
    });
  };
  const updateSeriesIndex = (seriesIndex: number): void => {
    dispaych({
      type: UPDATE_SERIES_INDEX,
      payload: seriesIndex,
    });
  };
  const updateDataItem = (index: number, value: PlayerDataI): void => {
    dispaych({
      type: UPDATE_DATA_ITEM,
      payload: {
        index,
        value,
      },
    });
  };

  return {
    ...playerReducerData,
    currentData: getCurrentData(),
    initCs,
    initCst,
    updateDataItem,
    updateData,
    updateReducer,
    updateSeriesIndex,
  };
};
