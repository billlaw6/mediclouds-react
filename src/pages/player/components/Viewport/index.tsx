import React, { FunctionComponent, useEffect, useState, useRef } from "react";

interface ViewportPropsI {
  width: number;
  height: number;
}

const Viewport: FunctionComponent<ViewportPropsI> = (props) => {
  const { width, height } = props;
  const $viewport = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  /* 更新 */
  useEffect(() => {
    if ($viewport.current) {
      const _ctx = $viewport.current.getContext("2d");
      if (_ctx) setCtx(_ctx);
    }
  }, []);

  return (
    <canvas className="player-viewport" ref={$viewport} width={width} height={height}></canvas>
  );
};

export default Viewport;
