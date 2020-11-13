/** absolute import */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

/** relative import */
import draw from "_pages/player/methods/draw";

import { ViewportPropsI } from "./types";

import "./style.less";

const Viewport: FunctionComponent<ViewportPropsI> = (props) => {
  /** parse props */
  const { cs, cst, data, className } = props;
  /** init hooks */
  const $viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!$viewport.current) return;
    cs.enable($viewport.current);

    const { LengthTool, WwwcTool, PanTool } = cst;

    // cst.addTool(LengthTool);
    cst.addTool(WwwcTool);
    cst.addTool(PanTool);

    // cst.setToolActive("Length", { mouseButtonMask: 1 });
    cst.setToolActive("Wwwc", { mouseButtonMask: 1 });
    // cst.setToolActive("Pan", { mouseButtonMask: 1 });
  }, [cs, cst]);

  useEffect(() => {
    if ($viewport.current) {
      draw({
        cs,
        data,
        el: $viewport.current,
      });
    }
  }, [data]);

  const _className = className ? `viewport ${className}` : "viewport";

  return <div className={_className} ref={$viewport}></div>;
};

export default Viewport;
