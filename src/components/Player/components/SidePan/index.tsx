import React, { FunctionComponent, ReactNode } from "react";

interface SidePanPropsI {
  className?: string;
  location?: "left" | "right";
  width?: number;
  show: boolean;
  onShow?: Function;
  onClose?: Function;
  triggerWidth?: number | string; // 收起时触发器的宽度
  triggerHeight?: number | string; // 触发器的高度
  float?: boolean; // 是否浮动
}

const SidePan: FunctionComponent<SidePanPropsI> = (props) => {
  const { className, float, location = "left", show } = props;

  return (
    <div
      className={`side-pan${float ? ` float` : ""}${className ? ` ${className}` : ""}`}
      style={{
        transform: show ? "translateX(0)" : "translate(-100%)",
      }}
    ></div>
  );
};

export default SidePan;
