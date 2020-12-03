import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";
import useData from "./useData";
import { useCallback } from "react";
import useWindows from "./useWindows";
import { WindowMapT } from "../types";

let timer = -1; // window 计时器

export default () => {
  const status = useSelector<StoreStateI, StoreStateI["playerStatus"]>(
    (state) => state.playerStatus,
  );
  const { isPlay } = status;
  const { getCurrentDatas, updateDatas } = useData();
  const { getCurrentWindows, updateWins } = useWindows();
  const dispatch = useDispatch();
  const { ENABLE_VIEWPORT, PLAY, PAUSE } = PlayerStatusActionE;

  const enableViewport = () => {
    dispatch({ type: ENABLE_VIEWPORT });
  };

  const pause = (): void => {
    window.clearInterval(timer);
    dispatch({ type: PAUSE });
  };

  const next = (): void => {
    const currentWins = getCurrentWindows();
    if (!currentWins) return;
    let tip = 0; // 是否暂停 当所有的序列都播放完成时变为1 则停止播放
    const nextWins: WindowMapT = new Map();

    currentWins.forEach((win, index) => {
      const { frame: frameInWindow = 0, data } = win;
      if (!data) return;
      const { cache } = data;
      if (cache && cache.length <= frameInWindow + 1) tip = 1;
      else tip = 0;

      const nextFrame = Math.min(cache ? cache.length - 1 : 0, frameInWindow + 1);

      nextWins.set(
        index,
        Object.assign({}, win, {
          frame: nextFrame,
        }),
      );
    });

    console.log("next wins", nextWins);
    updateWins(nextWins);
    if (tip) pause();
  };

  const play = (): void => {
    timer = window.setInterval(() => next(), 200);
    dispatch({ type: PLAY });
  };

  const prev = (): void => {
    const currentWins = getCurrentWindows();
    if (!currentWins) return;
    const nextWins: WindowMapT = new Map();

    currentWins.forEach((win, index) => {
      const { frame: frameInWindow = 0, data } = win;
      if (!data) return;

      const nextFrame = Math.max(0, frameInWindow - 1);

      nextWins.set(
        index,
        Object.assign({}, win, {
          frame: nextFrame,
        }),
      );
    });

    updateWins(nextWins);
  };

  return {
    ...status,
    enableViewport,
    play,
    pause,
    next,
    prev,
  };
};
