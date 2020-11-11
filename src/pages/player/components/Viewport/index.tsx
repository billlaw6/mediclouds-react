/** absolute import */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

/** relative import */
import draw from "_pages/player/methods/draw";

import { ViewportPropsI } from "./types";

import "./style.less";

const Viewport: FunctionComponent<ViewportPropsI> = (props) => {
  /** parse props */
  const { cs, cst, cstArr, data, className } = props;
  /** init hooks */
  const $viewport = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false); // 是否已经启用视图

  useEffect(() => {
    if (!$viewport.current) return;

    let isEnabled = enabled;

    if (!isEnabled) {
      // 初始化视图
      cs.enable($viewport.current);
      isEnabled = true;
      setEnabled(isEnabled);
    } else {
      /* 添加并激活工具 */
      cstArr.forEach((tool): void => {
        cst.addTool(tool);
        cst.setToolActive(tool.name, { mouseButtonMask: 1 });
        console.log("cst.store", cst.store);
      });
    }

    draw({
      cs,
      data,
      el: $viewport.current,
    });
  }, [cs, data, enabled]);

  const _className = className ? `viewport ${className}` : "viewport";

  return <div className={_className} ref={$viewport}></div>;
};

export default Viewport;
