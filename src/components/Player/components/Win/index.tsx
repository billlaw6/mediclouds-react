import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { Alert, message, Progress, Slider } from "antd";
import { SliderSingleProps } from "antd/lib/slider";

import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";

import useMouse from "_components/Player/hooks/useMouse";
import useMarks from "_components/Player/hooks/useMarks";
import { drawCircle } from "_components/Player/helpers";
import customerService from "_images/xiaoying-wechat-qrcode.png";

import Information from "../Information";
import "./style.less";

interface WinPropsI {
  data: WindowI;
  viewportWidth: number; // viewport宽度
}

let tempSeriesId = ""; // 是否与缓存的id不同

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { data: win, viewportWidth } = props;

  const { data: playerSeries, isFocus, isPlay, element, key, frame } = win;
  const { cs, cst, cacheSeries, updateSeries, lungNoduleReport, getPlayerSeriesById } = useData();
  const { addMark, updateMarkByData, Length = [] } = useMarks();
  const [viewport, setViewport] = useState<any>();

  const {
    updateWin,
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
  const [toolState, setToolState] = useState<{ toolName: string; data: any }>(); // 当前的toolstate

  const $window = useRef<HTMLDivElement>(null);

  const onCache = async (): Promise<boolean> => {
    // 缓存当前窗口内的序列
    if (!playerSeries) return false;
    const { cache, progress, examKey, key } = playerSeries;
    if (cache && progress === 100) return false;

    try {
      const cacheRes = await cacheSeries({
        data: playerSeries,
        onCaching: (progress) => {
          setLoadingProgress(progress);
        },
      });

      updateSeries(examKey, key, { progress: 100, cache: cacheRes });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const getCursor = (): string => {
    switch (currentToolName) {
      case "Length":
        return "copy";
      case "Pan":
        return "move";
      case "Wwwc":
        return "grabbing";
      case "McDragProbe":
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
      case 1:
        cst.setToolActiveForElement(element, "Pan", { mouseButtonMask: 1 });
        switchTool("Pan");
        updateMouseNum(1);
        break;
      case 4:
        cst.setToolActiveForElement(element, "Zoom", { mouseButtonMask: 4 });
        switchTool("Zoom");
        updateMouseNum(4);
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
    if (!mouseNum && currentToolName) return;

    cst.setToolDisabledForElement(element, currentToolName);
    switchTool("");
    updateMouseNum(0);
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (!cst || !element) return;

    const { code } = e;

    switch (code) {
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

  const draw = (): void => {
    if (!playerSeries || !element) return;
    const { cache, frame: frameInSeries, id } = playerSeries;
    if (!cache) return;

    const index = frame > -1 ? frame : frameInSeries;
    const currentImg = cache[index];
    if (!currentImg) {
      message.warn({
        content: (
          <span>
            没有可渲染的DICOM文件，请重新上传DICOM或微信扫码联系客服（Medimages）
            <img src={customerService} style={{ width: "220px" }}></img>
          </span>
        ),
        duration: 5000,
      });

      return;
    }

    if (tempSeriesId !== id) {
      cs.displayImage(element, currentImg, cs.getDefaultViewportForImage(element, currentImg));
      tempSeriesId = id;
      setViewport(cs.getViewport(element));
    } else {
      cs.displayImage(element, currentImg);
    }
  };

  const onMeasureRemove = (e: any) => {
    cs && cs.updateImage(e.detail.element);
  };
  const onMeasureAdded = (e: any) => {
    const { toolName, measurementData } = e.detail;

    addMark(toolName, measurementData);
  };

  const onMeasureUpdate = (e: any): void => {
    const { toolName, measurementData } = e.detail;

    setToolState({ toolName, data: measurementData });
  };

  /** 当浏览器渲染时触发 */
  const onImageRendered = useCallback(
    (e: any) => {
      if (!cs) return;
      const { element, data: playerSeries } = win;
      if (!element) return;

      /** 更新viewport */
      const currentViewport = cs.getViewport(element);
      setViewport(currentViewport);

      /** 如果有lungNodule渲染结节坐标 */
      if (!lungNoduleReport || !playerSeries) return;
      const currentLungNoduleReport = lungNoduleReport.get(win.key);
      if (!currentLungNoduleReport) return;
      const { nodule_details, series_id } = currentLungNoduleReport;
      if (!nodule_details || playerSeries.id !== series_id) return;
      nodule_details.forEach((nodule) => {
        const { disp_z, img_x, img_y, rad_pixel } = nodule;
        if (win.frame === disp_z) {
          const ctx = e.detail.canvasContext;
          drawCircle(ctx, img_x, img_y, Math.max(6, rad_pixel + 2));
        }
      });
    },
    [win, cs, lungNoduleReport],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeydown);
    // document.addEventListener("keyup", onKeyup);

    // 初始化在cs上启用窗口 并将当前窗口的HTML元素更新到当前窗口数据内
    if (cs && cst && $window.current && !element) {
      cs.enable($window.current);
      updateWin(key, { element: $window.current });
      // $window.current.addEventListener("keydown", onKeydown);
    }

    if (element) {
      element.addEventListener("cornerstoneimagerendered", onImageRendered);
      element.addEventListener("cornerstonetoolsmeasurementremoved", onMeasureRemove);
      element.addEventListener("cornerstonetoolsmeasurementmodified", onMeasureUpdate);
      element.addEventListener("cornerstonetoolsmeasurementcompleted", onMeasureAdded);
    }

    return () => {
      document.removeEventListener("keydown", onKeydown);
      if (element) {
        element.removeEventListener("cornerstoneimagerendered", onImageRendered);
        element.removeEventListener("cornerstonetoolsmeasurementremoved", onMeasureRemove);
        element.removeEventListener("cornerstonetoolsmeasurementmodified", onMeasureUpdate);
        element.removeEventListener("cornerstonetoolsmeasurementcompleted", onMeasureAdded);
      }
    };
  }, [cs, cst, element, Length, onImageRendered]);

  useEffect(() => {
    // 当显示左右侧边栏时，以新尺寸重新渲染窗口
    if (!element) return;

    cs.resize(element, false);
  }, [showLeftPan, showRightPan]);

  useEffect(() => {
    // 当当前的窗口数据改变时，重新渲染窗口
    if (!element) return;

    onCache()
      .then((reset) => {
        if (element.hidden) element.hidden = false;
        draw();
      })
      .catch((err) => console.error(err));
  }, [element, playerSeries, frame, isFocus]);

  useEffect(() => {
    if (!toolState) return;

    const { toolName, data } = toolState;

    updateMarkByData(toolName, data);
  }, [toolState]);

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
            updateWin(key, { frame: val });
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
        onKeyDown={(e: any) => onKeydown(e)}
      >
        {showExamInfo ? <Information viewport={viewport} win={win}></Information> : null}
      </div>
    </div>
  );
};

export default Win;
