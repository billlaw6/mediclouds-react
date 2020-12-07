import React, { FunctionComponent, useEffect, useRef } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import draw from "_components/Player/methods/draw";
import { WindowI } from "_components/Player/types";

import "./style.less";

interface WinPropsI {
  index: number; // 在window映射集合内的索引
  data?: WindowI;
  viewportWidth: number; // viewport宽度
}

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { index, data, viewportWidth } = props;

  const { cs } = useData();
  const { updateWindow } = useWindows();
  const { showLeftPan, showRightPan } = useStatus();

  const $window = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cs && $window.current) {
      cs.enable($window.current);

      updateWindow(
        index,
        Object.assign({}, data, {
          element: $window.current,
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    const { element } = data;
    if (!element) return;

    cs.resize(element, true);

    draw({
      cs,
      win: data,
    });
  }, [data, showLeftPan, showRightPan]);

  const width = viewportWidth - (showLeftPan ? 300 : 0) - (showRightPan ? 300 : 0);

  return (
    <div
      className="player-window"
      style={{
        width: `${width}px`,
      }}
    >
      <div className="player-window-content" ref={$window}></div>
    </div>
  );
};

export default Win;
