import { ApiOutlined } from "@ant-design/icons";
import React, { FunctionComponent, ReactNode, useState } from "react";
import Scrollbars from "react-custom-scrollbars";

import "./style.less";

interface SidePanPropsI {
  className?: string;
  location?: "left" | "right"; // 位置
  width?: string; // 宽度 默认200px
  onShow?: Function; // 展开时触发
  onClose?: Function; // 收起时触发
  triggerWidth?: number | string; // 收起时触发器的宽度
  triggerHeight?: number | string; // 触发器的高度
  show?: boolean; // 是否展开
  header?: ReactNode; // 头部
}

const SidePan: FunctionComponent<SidePanPropsI> = (props) => {
  const { className, location = "left", children, show, header } = props;

  const getClassName = (): string => {
    let res = "side-pan";
    if (show) res += " show";

    if (location === "left") res += " left";
    else res += " right";

    if (className) res += ` ${className}`;

    return res;
  };

  return (
    <div className={getClassName()}>
      {header}
      <div className="side-pan-scrollbar">
        <Scrollbars autoHide>
          <div className="side-pan-content">{children}</div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default SidePan;
