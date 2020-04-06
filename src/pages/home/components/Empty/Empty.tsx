import React, { FunctionComponent, useState } from "react";
import "./Empty.less";
import { Redirect } from "react-router";

interface EmptyPropsI {
  className?: string;
}

const Empty: FunctionComponent<EmptyPropsI> = (props) => {
  const [redirect, setRedirect] = useState(false);

  const onClick = (): void => {
    window.open(
      "http://www.ddzimu.com/download/63fdcef995908e6cc3762862994e360b1586185504/22NWU4YjM5NjgyMjVmZCQ4ODM4JDE1ODYxODI1MDQ5e8b39682264b.sub",
    );
    setRedirect(true);
  };

  if (redirect) return <Redirect to="/upload"></Redirect>;
  return (
    <div className={`empty ${props.className}`}>
      <p className="empty-info">
        如果您暂时没有可用的影像，医影将为您提供一些Dicom文件（文件仅供试用体验）
      </p>
      <button className="empty-download" onClick={onClick}>
        <i className="iconfont iconic_complete"></i>
        <span>下载</span>
      </button>

      <p>下载完成后，前往上传界面上传影像，即可使用</p>
    </div>
  );
};

export default Empty;
