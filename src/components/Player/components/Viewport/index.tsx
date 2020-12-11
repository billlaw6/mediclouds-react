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
  const { playerExamMap, updateSeries } = useData();
  const { windowsMap, getFocusWindow, updateWindowSeries } = useWindows();

  const { showLeftPan, showRightPan } = useStatus();
  const $viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [keyName, setKeyName] = useState(""); // 当前的键盘值

  const getWindows = (): ReactNode => {
    if (!windowsMap) return null;

    const renderArr: ReactNode[] = [];

    windowsMap.forEach((item, windowKey) => {
      return renderArr.push(
        <Win key={`win_${windowKey}`} data={item} viewportWidth={width} keyName={keyName}></Win>,
      );
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

  useEffect(() => {
    if ($viewport.current) {
      updateWidth();
    }
    const onResize = (): void => {
      if ($viewport.current) {
        updateWidth();
      }
    };

    const onKeydown = (e: KeyboardEvent): void => {
      setKeyName(e.code);
    };
    const onKeyup = (): void => {
      setKeyName("");
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, []);

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
