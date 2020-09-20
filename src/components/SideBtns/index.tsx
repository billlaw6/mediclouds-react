import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import helperVideo from "_assets/videos/helper.mp4";
import wechatQrcode from "_images/wechat-qrcode.jpg";
import medicloudsQrcode from "_images/mediclouds_qrcode.jpg";

import "./style.less";

const SideBtns: FunctionComponent = () => {
  const [showHelper, setShowHelper] = useState(false);
  const $video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if ($video.current) {
      if (!showHelper) $video.current.pause();
    }
  }, [showHelper]);

  return (
    <>
      <div className="side-btns">
        <div className="side-btns-item" style={{ cursor: "pointer" }}>
          <span className="side-btns-item-target" onClick={(): void => setShowHelper(true)}>
            <QuestionCircleOutlined style={{ fontSize: "24px" }} />
          </span>
        </div>
        <div className="side-btns-item">
          <div className="side-btns-item-pop">
            <b>解决关于DICOM的各种问题，请用微信扫码添加。</b>
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
      <Modal visible={showHelper} footer={null} onCancel={() => setShowHelper(false)} width={800}>
        <video ref={$video} src={helperVideo} autoPlay controls style={{ width: "100%" }}></video>
      </Modal>
    </>
  );
};

export default SideBtns;
