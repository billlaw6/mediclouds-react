import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import { getActiveCollections, setCollection } from "_components/Player/helpers";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { PlayerExamMapT } from "_components/Player/types";
import SeriesCard from "../SeriesCard";
import SidePan from "../SidePan";
import Win from "../Win";

import "./style.less";

interface ViewportPropsI {
  playerExamMap?: PlayerExamMapT;
}

const Viewport: FunctionComponent = () => {
  const { playerExamMap, getCurrentSeries } = useData();
  const { windowsMap } = useWindows();
  const { showLeftPan, showRightPan } = useStatus();
  const $viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const getWindows = (): ReactNode => {
    if (!windowsMap) return null;

    const renderArr: ReactNode[] = [];
    windowsMap.forEach((item, index) => {
      const { playerSeries } = item;
      const key = playerSeries ? `${playerSeries.id}` : `${Date.now()}`;

      return renderArr.push(<Win key={key} index={index} data={item} viewportWidth={width}></Win>);
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
    if (!playerExamMap) return null;

    console.log("getCurrentSeries", getCurrentSeries());
    const currentCollection = getActiveCollections(playerExamMap)[0];
    const res: ReactNode[] = [];
    const { playerSeriesMap, seriesIndex } = currentCollection;

    playerSeriesMap.forEach((data) => {
      const { id } = data;

      res.push(
        <SeriesCard
          data={data}
          key={`${id}`}
          active={seriesIndex === data.seriesIndex}
          onClick={(data): void => {
            console.log("click ", data);
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

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div id="viewport" ref={$viewport}>
      <SidePan location="left" show={showLeftPan}>
        {getSeriesList()}
      </SidePan>
      <div className="viewport-windows">{getWindows()}</div>
      <SidePan location="right" show={showRightPan}></SidePan>
    </div>
  );
};

export default Viewport;
