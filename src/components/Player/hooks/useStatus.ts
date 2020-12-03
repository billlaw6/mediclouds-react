import { useDispatch, useSelector } from "react-redux";
import { PlayerStatusActionE } from "../../../reducers/playerStatus";
import { StoreStateI } from "_types/core";
import useData from "./useData";
import { useCallback } from "react";

let timer = -1; // window 计时器

export default () => {
  const status = useSelector<StoreStateI, StoreStateI["playerStatus"]>(
    (state) => state.playerStatus,
  );
  const { isPlay } = status;
  const { getCurrentDatas, updateDatas } = useData();
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
    const currentDatas = getCurrentDatas();
    if (!currentDatas) return;
    let tip = 0; // 是否暂停 当所有的序列都播放完成时变为1 则停止播放

    const nextDatas = currentDatas.map((data) => {
      const { frame, cache } = data;
      if (cache && cache.length <= frame + 1) tip = 1;
      else tip = 0;

      const nextFrame = Math.min(cache ? cache.length - 1 : 0, frame + 1);

      return Object.assign({}, data, {
        frame: nextFrame,
      });
    });

    updateDatas(nextDatas);
    if (tip) pause();
  };

  const play = (): void => {
    timer = window.setInterval(() => next(), 200);
    dispatch({ type: PLAY });
  };

  const prev = (): void => {
    const currentDatas = getCurrentDatas();
    if (!currentDatas) return;

    const nextDatas = currentDatas.map((data) => {
      const { frame } = data;
      return Object.assign({}, data, {
        frame: Math.max(0, frame - 1),
      });
    });

    updateDatas(nextDatas);
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
