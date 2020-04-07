import React, { FunctionComponent } from "react";
import wechatQrcode from "_images/wechat-qrcode.jpg";
import "./style.less";

const SideBtns: FunctionComponent = () => {
  return (
    <div className="side-btns">
      <div className="side-btns-item">
        <div className="side-btns-item-pop">
          <b>小程序二维码</b>
          <img src={wechatQrcode}></img>
        </div>
        <span className="side-btns-item-target">
          <i className="iconfont iconic_phone"></i>
        </span>
      </div>
    </div>
  );
};

export default SideBtns;
