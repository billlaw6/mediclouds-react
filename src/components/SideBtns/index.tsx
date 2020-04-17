import React, { FunctionComponent } from "react";
import wechatQrcode from "_images/wechat-qrcode.jpg";
import medicloudsQrcode from "_images/mediclouds_qrcode.jpg";

import "./style.less";

const SideBtns: FunctionComponent = () => {
  return (
    <div className="side-btns">
      <div className="side-btns-item">
        <div className="side-btns-item-pop">
          <b>解决关于DICOM的 各种问题，请用微 信扫码添加。</b>
          <img src={medicloudsQrcode}></img>
          <b>医影二维码</b>
        </div>
        <span className="side-btns-item-target">
          <i className="iconfont iconic_WeChat"></i>
        </span>
      </div>
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
