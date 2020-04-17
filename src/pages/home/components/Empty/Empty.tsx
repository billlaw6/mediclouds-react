import React, { FunctionComponent, useState } from "react";
import "./Empty.less";
import { Redirect } from "react-router";
import { DownloadOutlined } from "@ant-design/icons";

interface EmptyPropsI {
  className?: string;
}

const Empty: FunctionComponent<EmptyPropsI> = (props) => {
  const [redirect, setRedirect] = useState(false);

  const onClick = (): void => {
    window.open("http://www.dodowon.com/test_dicom.zip");
    setRedirect(true);
  };

  if (redirect) return <Redirect to="/upload"></Redirect>;
  return (
    <div className={`empty ${props.className}`}>
      <p className="empty-info">
        如果您暂时没有可用的医学影像，医影为您提供一些DICOM文件用于体验（文件仅供试用体验，医影对用户因使用试用文件造成的任何法律风险概不负责）
      </p>
      <p>如果您还想了解更多关于获得DICOM医学影像的方式与方法，请加微信</p>
      <img src="#" alt="wechat_qrcode" />
      <button className="empty-download" onClick={onClick}>
        <i className="iconfont iconic_download"></i>
        <span>下载</span>
      </button>

      <p>下载完成后，前往上传界面上传影像，即可使用</p>
    </div>
  );
};

export default Empty;
