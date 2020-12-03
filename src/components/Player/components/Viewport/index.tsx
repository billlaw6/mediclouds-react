import React, { FunctionComponent, useEffect, useRef } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import draw from "_components/Player/methods/draw";
import { CollectionMapT } from "_components/Player/types";
import SidePan from "../SidePan";

import "./style.less";

interface ViewportPropsI {
  collectionMap?: CollectionMapT;
}

const Viewport: FunctionComponent<ViewportPropsI> = (props) => {
  const { collectionMap } = props;

  const { cs } = useData();
  const { enabledViewport, enableViewport } = useStatus();

  const $windows = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!$windows.current || !cs) return;
    if (!enabledViewport) {
      cs.enable($windows.current);
      enableViewport();
    }
  }, [cs]);

  useEffect(() => {
    const _data = collectionMap ? collectionMap.get(0)?.dataMap.get(0) : undefined;

    console.log("data >>>", _data);

    if ($windows.current && _data && enabledViewport) {
      draw({
        cs,
        data: _data,
        el: $windows.current,
      });
    }
  }, [collectionMap, cs, enabledViewport]);

  return (
    <div id="viewport">
      <SidePan location="left"></SidePan>
      <div className="viewport-windows" ref={$windows}></div>
      <SidePan location="right"></SidePan>
    </div>
  );
};

export default Viewport;
