import { ApiOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import React, { FunctionComponent, ReactNode, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import useStatus from "_components/Player/hooks/useStatus";

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
  isScroll?: boolean; // 是否启用滚动
}

const SidePan: FunctionComponent<SidePanPropsI> = (props) => {
  const { showLeftPan, showRightPan, switchPan } = useStatus();
  const { className, location = "left", children, show, header, isScroll } = props;

  const getClassName = (): string => {
    let res = "side-pan";
    if (show) res += " show";

    if (location === "left") res += " left";
    else res += " right";

    if (className) res += ` ${className}`;

    return res;
  };

  let arrow = <LeftOutlined />;
  if ((show && location === "right") || (!show && location === "left")) arrow = <RightOutlined />;

  return (
    <div className={getClassName()}>
      {header}
      <div className="side-pan-scrollbar">
        {isScroll ? (
          <Scrollbars autoHide>
            <div className="side-pan-content">{children}</div>
          </Scrollbars>
        ) : (
          <div className="side-pan-content">{children}</div>
        )}
      </div>
      <div
        className="side-pan-handle"
        onClick={(): void => {
          switchPan(location, location === "left" ? !showLeftPan : !showRightPan);
        }}
      >
        {arrow}
      </div>
    </div>
  );
};

export default SidePan;
