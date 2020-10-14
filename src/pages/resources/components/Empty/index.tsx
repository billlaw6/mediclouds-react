import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";

import "./style.less";

interface EmptyPropsI {
  className?: string;
}

const Empty: FunctionComponent<EmptyPropsI> = (props) => {
  const [redirect, setRedirect] = useState(false);

  const onClick = (): void => {
    window.open("https://mediclouds.oss-cn-beijing.aliyuncs.com/Test_DICOM.zip");
    setRedirect(true);
  };

  if (redirect) return <Redirect to="/upload"></Redirect>;
  return (
    <div className={`empty ${props.className}`}>
      <p className="empty-info">如果您暂时没有可用的医学影像，医影为您提供一些DICOM文件用于体验</p>
      <p>（文件仅供试用体验，医影对用户因使用试用文件造成的任何法律风险概不负责）</p>
      <button className="empty-download" onClick={onClick}>
        <i className="iconfont iconic_download"></i>
        <span>下载</span>
      </button>

      <p className="empty-info-tip">下载完成后，前往上传界面上传影像，即可使用</p>
    </div>
  );
};

export default Empty;
