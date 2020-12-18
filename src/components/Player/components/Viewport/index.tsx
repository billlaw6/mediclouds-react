import { Tabs } from "antd";
import React, { FunctionComponent, ReactNode, useEffect, useRef, useState } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import McDragProbeTool from "_components/Player/tools/dragProbeTool";
import { WindowI } from "_components/Player/types/window";
import AiReports from "../AiReports";
import Marks from "../Marks";
import SeriesCard from "../SeriesCard";
import SidePan from "../SidePan";
import Win from "../Win";

import "./style.less";

const { TabPane } = Tabs;

const Viewport: FunctionComponent = () => {
  const { playerExamMap, cs, cst } = useData();
  const { windowsMap, getFocusWindow, updateWin } = useWindows();
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

            updateWin(focusWindow.key, { data: result });
          }}
        ></SeriesCard>,
      );
    });

    return res;
  };

  const getExtensions = () => {
    return (
      <Tabs className="player-extensions">
        <TabPane className="player-extensions-panel" key="marks" tab="标注">
          <Marks></Marks>
        </TabPane>
        <TabPane className="player-extensions-panel" key="aiReport" tab="AI报告">
          <AiReports></AiReports>
        </TabPane>
      </Tabs>
    );
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
      const { WwwcTool, PanTool, ZoomTool, LengthTool, DragProbeTool } = cst;
      cst.addTool(WwwcTool); // 调窗
      cst.addTool(PanTool); // 移动
      cst.addTool(ZoomTool, {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.1,
        maxScale: 20.0,
      });
      cst.addTool(LengthTool);
      cst.addTool(DragProbeTool, {
        defaultStrategy: "minimal",
      });
      cst.addTool(McDragProbeTool);

      setCurrentWinKey(key);
    }
  }, [focusWin, cs, cst, currentWinKey]);

  return (
    <div id="viewport" ref={$viewport}>
      <SidePan location="left" show={showLeftPan} isScroll>
        {getSeriesList()}
      </SidePan>
      <div className="viewport-windows">{getWindows()}</div>
      <SidePan location="right" show={showRightPan}>
        {getExtensions()}
      </SidePan>
    </div>
  );
};

export default Viewport;
