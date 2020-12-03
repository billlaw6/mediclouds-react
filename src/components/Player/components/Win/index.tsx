import React, { FunctionComponent, useEffect, useRef } from "react";
import useData from "_components/Player/hooks/useData";
import useWindows from "_components/Player/hooks/useWindows";
import draw from "_components/Player/methods/draw";
import { WindowI } from "_components/Player/types";

import "./style.less";

interface WinPropsI {
  index: number; // 在window映射集合内的索引
  data?: WindowI;
}

const Win: FunctionComponent<WinPropsI> = (props) => {
  const { index, data } = props;

  const { cs } = useData();
  const { updateWindow } = useWindows();
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

    draw({
      cs,
      win: data,
    });
  }, [data]);

  return <div className="player-window" ref={$window}></div>;
};

export default Win;
