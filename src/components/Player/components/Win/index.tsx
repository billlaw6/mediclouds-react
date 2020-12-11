import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Progress, Slider } from "antd";
import { SliderSingleProps } from "antd/lib/slider";

import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import draw from "_components/Player/methods/draw";
import { WindowI } from "_components/Player/types/window";

import "./style.less";
interface WinPropsI {
  data: WindowI;
  viewportWidth: number; // viewport宽度
  keyName?: string; // 当前按下的键盘值
}

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { data: win, viewportWidth, keyName } = props;

  const { data: playerSeries, isFocus, isPlay, element, key, frame } = win;
  const { cs, cacheSeries, updateSeries } = useData();
  const { updateWindow, next, prev, nextSeries, prevSeries, play, pause } = useWindows();
  const { showLeftPan, showRightPan } = useStatus();
  const [loadingProgress, setLoadingProgress] = useState(-1); // 当前窗口加载进度

  const $window = useRef<HTMLDivElement>(null);

  const onCache = async (): Promise<void> => {
    // 缓存当前窗口内的序列
    if (!playerSeries) return;
    const { cache, progress, examKey, key } = playerSeries;
    if (cache && progress === 100) return;

    try {
      const cacheRes = await cacheSeries({
        data: playerSeries,
        onCaching: (progress) => {
          setLoadingProgress(progress);
        },
      });

      updateSeries(examKey, key, { progress: 100, cache: cacheRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    // 初始化在cs上启用窗口 并将当前窗口的HTML元素更新到当前窗口数据内
    const { element } = win;

    if (cs && $window.current && !element) {
      cs.enable($window.current);
      updateWindow(key, { element: $window.current });
    }
  }, []);

  useEffect(() => {
    // 当显示左右侧边栏时，以新尺寸重新渲染窗口
    if (!element) return;

    cs.resize(element, false);
  }, [showLeftPan, showRightPan]);

  useEffect(() => {
    // 当当前的窗口数据改变时，重新渲染窗口
    if (!element) return;

    onCache()
      .then(() => {
        if (element.hidden) element.hidden = false;
        draw({
          cs,
          win,
        });
      })
      .catch((err) => console.error(err));
  }, [element, playerSeries, frame, isFocus]);

  useEffect(() => {
    if (!isFocus) return;
    switch (keyName) {
      case "ArrowRight":
        next(win);
        break;
      case "ArrowLeft":
        prev(win);
        break;
      case "ArrowUp":
        prevSeries(win);
        break;
      case "ArrowDown":
        nextSeries(win);
        break;
      case "Space":
        if (isFocus) {
          isPlay ? pause() : play();
        }
        break;
      default:
        break;
    }
  }, [keyName, isFocus]);

  const width = viewportWidth - (showLeftPan ? 300 : 0) - (showRightPan ? 300 : 0);

  const sliderProps: SliderSingleProps = {
    step: 1,
    min: 0,
    value: 0,
    max: 1,
  };

  if (playerSeries && playerSeries.cache) sliderProps.max = playerSeries.cache.length - 1;

  sliderProps.value = frame;

  const onLoading = loadingProgress > -1 && loadingProgress < 100;

  console.log("isPlay", isPlay);
  return (
    <div
      className={`player-window${win && win.isFocus ? " focus" : ""}`}
      data-win-key={win ? win.key : ""}
    >
      {onLoading ? (
        <Progress
          className="player-window-progress"
          showInfo
          type="circle"
          percent={loadingProgress}
          width={80}
        />
      ) : (
        <Slider
          className="player-window-slider"
          disabled={onLoading}
          {...sliderProps}
          onChange={(val: number): void => {
            updateWindow(key, { frame: val });
          }}
        ></Slider>
      )}
      <div
        className="player-window-content"
        onWheel={(e): void => {
          const { deltaY } = e;
          if (deltaY > 0) {
            next(win);
          } else {
            prev(win);
          }
        }}
        ref={$window}
      ></div>
    </div>
  );
};

export default Win;
