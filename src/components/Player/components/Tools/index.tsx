import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { FunctionComponent } from "react";
import useStatus from "_components/Player/hooks/useStatus";
import Controller from "../Controller";

import "./style.less";

const Tools: FunctionComponent = () => {
  const { showLeftPan, showRightPan, switchPan } = useStatus();

  return (
    <div id="tools" className="tools">
      <div className="tools-left">
        <MenuUnfoldOutlined
          className={`tools-item${showLeftPan ? " active reverse" : ""}`}
          onClick={(): void => switchPan("left", !showLeftPan)}
        />
      </div>
      <div className="tools-right">
        {/* <Controller></Controller> */}
        <MenuFoldOutlined
          className={`tools-item${showRightPan ? " active reverse-right" : ""}`}
          onClick={(): void => switchPan("right", !showRightPan)}
        />
      </div>
    </div>
  );
};

export default Tools;
