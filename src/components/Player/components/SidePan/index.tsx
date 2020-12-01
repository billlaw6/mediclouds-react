import React, { FunctionComponent, useState } from "react";

import "./style.less";

interface SidePanPropsI {
  className?: string;
  location?: "left" | "right"; // 位置
  width?: string; // 宽度 默认200px
  onShow?: Function; // 展开时触发
  onClose?: Function; // 收起时触发
  triggerWidth?: number | string; // 收起时触发器的宽度
  triggerHeight?: number | string; // 触发器的高度
  float?: boolean; // 是否浮动
}

const SidePan: FunctionComponent<SidePanPropsI> = (props) => {
  const { className, float = true, location = "left", children, width = "200px" } = props;

  const [show, setShow] = useState(false);

  const getClassName = (): string => {
    let res = "side-pan";
    if (show) res += " show";
    if (float) res += " float";

    if (location === "left") res += " left";
    else res += " right";

    if (className) res += ` ${className}`;

    return res;
  };

  const getTriggerArrow = () => {
    let res = "<";
    if (location === "left" && !show) {
      res = ">";
    }

    if (location === "right" && show) {
      res = ">";
    }

    return res;
  };

  return (
    <div
      className={getClassName()}
      style={{
        width,
      }}
    >
      <div className="side-pan-trigger" onClick={(): void => setShow(!show)}>
        {getTriggerArrow()}
      </div>
      {children}
    </div>
  );
};

export default SidePan;
