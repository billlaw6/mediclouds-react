import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Progress, Slider } from "antd";
import { SliderSingleProps } from "antd/lib/slider";

import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";

import Information from "../Information";
import useMouse from "_components/Player/hooks/useMouse";

import "./style.less";
interface WinPropsI {
  data: WindowI;
  viewportWidth: number; // viewport宽度
}

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { data: win, viewportWidth } = props;

  const { data: playerSeries, isFocus, isPlay, element, key, frame } = win;
  const { cs, cst, cacheSeries, updateSeries } = useData();

  const [cstStateManager, setCstStateManager] = useState<any>();

  const {
    updateWindow,
    next,
    prev,
    nextSeries,
    prevSeries,
    play,
    pause,
    resetWindowImage,
  } = useWindows();
  const {
    showLeftPan,
    showRightPan,
    showExamInfo,
    mouseNum,
    currentToolName,
    switchTool,
  } = useStatus();
  const { updateMouseNum } = useMouse();

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

  const getCursor = (): string => {
    switch (currentToolName) {
      case "Pan":
        return "move";
      case "Wwwc":
        return "crosshair";
      case "Zoom":
        return "zoom-in";
      default:
        return "default";
    }
  };

  const onMousedown = (e: MouseEvent): void => {
    if (!cst || !element || currentToolName) return;

    const { buttons } = e;

    switch (buttons) {
      case 4:
        cst.setToolActiveForElement(element, "Pan", { mouseButtonMask: 4 });
        switchTool("Pan");
        updateMouseNum(4);
        break;
      case 1:
        cst.setToolActiveForElement(element, "Zoom", { mouseButtonMask: 1 });
        switchTool("Zoom");
        updateMouseNum(1);
        break;
      case 2:
        cst.setToolActiveForElement(element, "Wwwc", { mouseButtonMask: 2 });
        switchTool("Wwwc");
        updateMouseNum(2);
        break;
      default:
        break;
    }
  };
  const onMouseup = () => {
    if (!mouseNum) return;

    cst.setToolPassiveForElement(element, currentToolName);
    switchTool("");
    updateMouseNum(0);
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (!cst || !element) return;

    const { code } = e;

    switch (code) {
      case "KeyX":
        cst.setToolActiveForElement(element, "Pan", { mouseButtonMask: 1 });
        switchTool("Pan");
        break;
      case "KeyZ":
        cst.setToolActiveForElement(element, "Zoom", { mouseButtonMask: 1 });
        switchTool("Zoom");
        break;
      case "KeyC":
        cst.setToolActiveForElement(element, "Wwwc", { mouseButtonMask: 1 });
        switchTool("Wwwc");
        break;
      case "KeyR":
        resetWindowImage();
        break;
      case "ArrowRight":
        next();
        break;
      case "ArrowLeft":
        prev();
        break;
      case "ArrowUp":
        prevSeries();
        break;
      case "ArrowDown":
        nextSeries();
        break;
      case "Space":
        if (isFocus) {
          isPlay ? pause() : play();
        }
        break;
      default:
        break;
    }
  };

  const onKeyup = () => {
    if (currentToolName) {
      cst.setToolPassiveForElement(element, currentToolName);

      switchTool("");
    }
  };

  const draw = (): void => {
    if (!playerSeries || !element) return;
    const { cache, frame: frameInSeries } = playerSeries;
    if (!cache) return;

    console.log("draw");
    const index = frame > -1 ? frame : frameInSeries;
    const currentImg = cache[index];

    cs.displayImage(element, currentImg);
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    // 初始化在cs上启用窗口 并将当前窗口的HTML元素更新到当前窗口数据内
    if (cs && cst && $window.current && !element) {
      cs.enable($window.current);
      setCstStateManager(cst.getElementToolStateManager($window.current));

      updateWindow(key, { element: $window.current });
    }

    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
    };
  }, [cs, cst, element]);

  useEffect(() => {
    // 当显示左右侧边栏时，以新尺寸重新渲染窗口
    if (!element) return;

    cs.resize(element, false);
  }, [showLeftPan, showRightPan]);

  useEffect(() => {
    // 当当前的窗口数据改变时，重新渲染窗口
    if (!element) return;

    cstStateManager && console.log("cstStateManager.get(element);", cstStateManager.get(element));

    onCache()
      .then(() => {
        if (element.hidden) element.hidden = false;
        draw();
      })
      .catch((err) => console.error(err));
  }, [element, playerSeries, frame, isFocus]);

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
        onMouseDown={(e) => onMousedown(e.nativeEvent)}
        onMouseUp={onMouseup}
        style={{ cursor: getCursor() }}
        ref={$window}
      >
        {showExamInfo ? <Information win={win}></Information> : null}
      </div>
    </div>
  );
};

export default Win;
