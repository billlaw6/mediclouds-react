import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import { getActiveCollections, setCollection } from "_components/Player/helpers";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { PlayerExamMapT } from "_components/Player/types/exam";
import { PlayerSeriesI, PlayerSeriesMapT } from "_components/Player/types/series";
import { WindowI } from "_components/Player/types/window";
import SeriesCard from "../SeriesCard";
import SidePan from "../SidePan";
import Win from "../Win";

import "./style.less";

interface ViewportPropsI {
  playerExamMap?: PlayerExamMapT;
}

const Viewport: FunctionComponent = () => {
  const { playerExamMap, cacheSeries, updateSeries } = useData();
  const { windowsMap, getFocusWindow, updateWindow } = useWindows();

  const { showLeftPan, showRightPan } = useStatus();
  const $viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const getWindows = (): ReactNode => {
    if (!windowsMap) return null;

    const renderArr: ReactNode[] = [];

    windowsMap.forEach((item, windowKey) => {
      const { data } = item;
      const key = data ? `${data.id}` : `${Date.now()}`;

      return renderArr.push(<Win key={key} data={item} viewportWidth={width}></Win>);
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
            const { data, key, frame } = focusWindow;
            if (data && data.id === result.id) return;

            updateWindow(
              key,
              Object.assign({}, focusWindow, { data: result, frame: result.frame }),
            );
            updateSeries([Object.assign({}, data, { frame })]);
          }}
        ></SeriesCard>,
      );
    });

    return res;
  };

  const onCache = (series: PlayerSeriesI): void => {
    cacheSeries({
      data: series,
      onBeforeCache: (data) => {
        console.log("before cache", data);
      },
      onCaching: (progress, data) => {
        console.log("progress", progress);
      },
    });
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

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // useEffect(() => {
  //   if (!windowsMap) return;
  //   const currentWindow = getFocusWindow();
  //   if (!currentWindow || !currentWindow.data) return;
  //   const { progress, cache } = currentWindow.data;
  //   if (!progress || progress !== 100 || !cache) {
  //     onCache(currentWindow.data);
  //   }
  // }, [getFocusWindow, windowsMap]);

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
