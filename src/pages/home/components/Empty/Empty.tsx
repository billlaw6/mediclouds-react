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
        如果您暂时没有可用的影像，医影将为您提供一些Dicom文件（文件仅供试用体验）
      </p>
      <button className="empty-download" onClick={onClick}>
        <i className="iconfont iconic_download"></i>
        <span>下载</span>
      </button>

      <p>下载完成后，前往上传界面上传影像，即可使用</p>
    </div>
  );
};

export default Empty;
