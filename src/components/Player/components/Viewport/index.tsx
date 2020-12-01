import React, { FunctionComponent, useEffect, useRef } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import draw from "_components/Player/methods/draw";
import SidePan from "../SidePan";

import "./style.less";

const Viewport: FunctionComponent = () => {
  const { cs, currentData } = useData();
  const { enabledViewport, enableViewport } = useStatus();

  const $windows = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!$windows.current || !cs) return;
    if (!enabledViewport) {
      cs.enable($windows.current);
      enableViewport();
    }
  }, [cs]);

  console.log("enabledViewport", enabledViewport);

  useEffect(() => {
    if ($windows.current && currentData && enabledViewport) {
      draw({
        cs,
        data: currentData,
        el: $windows.current,
      });
    }
  }, [currentData, enabledViewport]);

  return (
    <div id="viewport">
      <SidePan location="left"></SidePan>
      <div className="viewport-windows" ref={$windows}></div>
      <SidePan location="right"></SidePan>
    </div>
  );
};

export default Viewport;
