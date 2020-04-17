import React, { FunctionComponent, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { checkDicomParseProgress } from "_helper";

import "./style.less";

const antIcon = <LoadingOutlined style={{ fontSize: 18 }} spin />;

interface NotifyPropsI {
  mode: "parsing" | "successed";
  onClose?: Function;
  onChange?: (count: number) => void;
}

const Notify: FunctionComponent<NotifyPropsI> = (props) => {
  const { mode = "parsing", onClose, onChange } = props;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = (): void => {
    if (mode === "successed" && onClose) onClose();
    else {
      setIsLoading(true);
      checkDicomParseProgress()
        .then((res) => {
          setTimeout(() => {
            onChange && onChange(res);
            setIsLoading(false);
          }, 3000);
        })
        .catch((err) => {
          console.error("pull parsing count error: ", err);
        });
    }
  };

  return (
    <div className={`notify ${mode === "parsing" ? "notify-parsing" : ""}`}>
      <i className="iconfont iconic_info"></i>
      <span className="notify-text">{props.children}</span>
      {mode === "parsing" ? (
        <Spin indicator={antIcon} />
      ) : (
        <i className={`notify-ctl iconfont iconic_close1`} onClick={onClick}></i>
      )}
      {/* {isLoading ? (
        <Spin indicator={antIcon} />
      ) : (
        <i
          className={`notify-ctl iconfont ${
            mode === "parsing" ? "iconic_refresh" : "iconic_close1"
          }`}
          onClick={onClick}
        ></i>
      )} */}
    </div>
  );
};

export default Notify;
