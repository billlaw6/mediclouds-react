/** absolute import */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

/** relative import */
import { ViewportPropsI } from "./types";

const Viewport: FunctionComponent<ViewportPropsI> = (props) => {
  /** parse props */
  const { cs, data, className } = props;
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
    }

    if (!data) return;

    const { cache, frame } = data;
    if (!cache) return;

    const currentImg = cache[frame];
    cs.displayImage($viewport.current, currentImg);
  }, [cs, data, enabled]);

  const _className = className ? `viewport ${className}` : "viewport";

  return <div className={_className} ref={$viewport}></div>;
};

export default Viewport;
