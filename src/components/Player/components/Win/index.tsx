import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Progress, Slider } from "antd";

import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import draw from "_components/Player/methods/draw";
import { WindowI } from "_components/Player/types/window";

import "./style.less";
import { SliderBaseProps, SliderSingleProps } from "antd/lib/slider";
interface WinPropsI {
  data?: WindowI;
  viewportWidth: number; // viewport宽度
}

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { data: win, viewportWidth } = props;

  const { cs, cacheSeries, updateSeries } = useData();
  const { updateWindow } = useWindows();
  const { showLeftPan, showRightPan } = useStatus();
  const [loadingProgress, setLoadingProgress] = useState(-1); // 当前窗口加载进度

  const $window = useRef<HTMLDivElement>(null);

  const onCache = async (): Promise<void> => {
    // 缓存当前窗口内的序列
    if (!win || !win.data) return;
    const { data } = win;
    const { cache, progress } = data;
    if (cache && progress === 100) return;

    try {
      const cacheRes = await cacheSeries({
        data,
        onCaching: (progress) => {
          setLoadingProgress(progress);
        },
      });

      const nextData = Object.assign({}, data, { progress: 100, cache: cacheRes });
      updateWindow(win.key, Object.assign({}, win, { data: nextData }));
      updateSeries([nextData]);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    // 初始化在cs上启用窗口 并将当前窗口的HTML元素更新到当前窗口数据内
    if (win && cs && $window.current) {
      cs.enable($window.current);

      updateWindow(
        win.key,
        Object.assign({}, win, {
          element: $window.current,
        }),
      );
    }
  }, []);

  useEffect(() => {
    // 当显示左右侧边栏时，以新尺寸重新渲染窗口
    if (!win) return;
    const { element } = win;
    if (!element) return;

    cs.resize(element, true);
  }, [showLeftPan, showRightPan]);

  useEffect(() => {
    // 当当前的窗口数据改变时，重新渲染窗口
    if (!win) return;
    const { element } = win;
    if (!element) return;

    onCache()
      .then(() => {
        cs.resize(element, true);

        draw({
          cs,
          win,
        });
      })
      .catch((err) => console.error(err));
  }, [win]);

  const width = viewportWidth - (showLeftPan ? 300 : 0) - (showRightPan ? 300 : 0);

  const sliderProps: SliderSingleProps = {
    step: 1,
    min: 0,
    value: 0,
    max: 1,
  };

  if (win) {
    const { frame, data } = win;
    if (data && data.cache) sliderProps.max = data.cache.length - 1;

    sliderProps.value = frame;
  }

  const onLoading = loadingProgress > -1 && loadingProgress < 100;

  return (
    <div
      className="player-window"
      style={{
        width: `${width}px`,
      }}
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
          vertical
          reverse
          disabled={onLoading}
          {...sliderProps}
          onChange={(val: number): void => {
            if (!win) return;

            updateWindow(
              win.key,
              Object.assign({}, win, {
                frame: val,
              }),
            );
          }}
        ></Slider>
      )}
      <div className="player-window-content" ref={$window}></div>
    </div>
  );
};

export default Win;
