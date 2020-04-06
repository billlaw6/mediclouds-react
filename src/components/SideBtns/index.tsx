import React, { FunctionComponent } from "react";
import "./style.less";

const SideBtns: FunctionComponent = () => {
  return (
    <div className="side-btns">
      <div className="side-btns-item">
        <div className="side-btns-item-pop"></div>
        <i className="iconfont iconic_info"></i>
      </div>
    </div>
  );
};

export default SideBtns;
