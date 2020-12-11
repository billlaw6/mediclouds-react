import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";
import SeriesCard from "../SeriesCard";
import SidePan from "../SidePan";
import Win from "../Win";

import "./style.less";

const Viewport: FunctionComponent = () => {
  const { playerExamMap, cs, cst } = useData();
  const { windowsMap, getFocusWindow, updateWindowSeries } = useWindows();
  const { movingMode, scaleMode, wwwcMode } = useStatus();

  const { showLeftPan, showRightPan } = useStatus();
  const $viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [currentWinKey, setCurrentWinKey] = useState<number>();

  const getWindows = (): ReactNode => {
    if (!windowsMap) return null;

    const renderArr: ReactNode[] = [];

    windowsMap.forEach((item, windowKey) => {
      return renderArr.push(<Win key={`win_${windowKey}`} data={item} viewportWidth={width}></Win>);
    });

    return renderArr;
  };

  const updateWidth = (): void => {
    if ($viewport.current) {
      setWidth($viewport.current.getBoundingClientRect().width);
    }
  };

  /** 获取当前已激活的 playerExam 的序列列表
   *
   * 目前仅显示第一个激活的playerExam
   *
   * TODOS:
   *  - 改成带Tabs的多个playerExam显示
   *
   */
  const getSeriesList = (): ReactNode => {
    if (!windowsMap || !playerExamMap) return null;
    const res: ReactNode[] = [];
    let currentWindow: WindowI | undefined;

    for (const val of windowsMap.values()) {
      if (val.isFocus) {
        currentWindow = val;
        break;
      } else {
        continue;
      }
    }

    if (!currentWindow || !currentWindow.data) return null;

    const { examKey, id } = currentWindow.data;
    const currentExam = playerExamMap.get(examKey);
    if (!currentExam || !currentExam.data) return null;

    currentExam.data.forEach((series) => {
      const { id: selfId } = series;

      res.push(
        <SeriesCard
          key={selfId}
          data={series}
          active={id === selfId}
          onClick={(result): void => {
            const focusWindow = getFocusWindow();
            if (!focusWindow || !focusWindow.data) return;
            const { data } = focusWindow;
            if (data && data.id === result.id) return;

            updateWindowSeries(focusWindow.key, result);
          }}
        ></SeriesCard>,
      );
    });

    return res;
  };

  const focusWin = getFocusWindow();

  useEffect(() => {
    if ($viewport.current) {
      updateWidth();
    }
    const onResize = (): void => {
      if ($viewport.current) {
        updateWidth();
      }
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!focusWin || !cs || !cst) return;
    const { element, key } = focusWin;
    if (element) return;

    // 当当前聚焦的窗口更新时候 重新加载 因为cornerstone需要先 enable 某个element
    if (!currentWinKey || key !== currentWinKey) {
      /** 初始化相关cornerstone tools */
      const { WwwcTool, PanTool, ZoomTool } = cst;
      cst.addTool(WwwcTool); // 调窗
      cst.addTool(PanTool); // 移动
      cst.addTool(ZoomTool, {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.1,
        maxScale: 20.0,
      });

      setCurrentWinKey(key);
    }
  }, [focusWin, cs, cst, currentWinKey]);

  useEffect(() => {
    if (!focusWin || !cst) return;

    const { element } = focusWin;

    if (!element) return;

    movingMode
      ? cst.setToolActiveForElement(element, "Pan", { mouseButtonMask: 1 })
      : cst.setToolDisabledForElement(element, "Pan");

    scaleMode
      ? cst.setToolActiveForElement(element, "Zoom", { mouseButtonMask: 1 })
      : cst.setToolDisabledForElement(element, "Zoom");

    wwwcMode
      ? cst.setToolActiveForElement(element, "Wwwc", { mouseButtonMask: 1 })
      : cst.setToolDisabledForElement(element, "Wwwc");
  }, [wwwcMode, movingMode, scaleMode, focusWin]);

  return (
    <div id="viewport" ref={$viewport}>
      <SidePan location="left" show={showLeftPan}>
        {getSeriesList()}
        view
      </SidePan>
      <div className="viewport-windows">{getWindows()}</div>
      <SidePan location="right" show={showRightPan}></SidePan>
    </div>
  );
};

export default Viewport;
