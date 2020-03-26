import React, { FunctionComponent } from "react";

import "./style.less";
import { checkDicomParseProgress } from "_helper";

interface NotifyPropsI {
  mode: "parsing" | "successed";
  onClose?: Function;
  onChange?: (count: number) => void;
}

const Notify: FunctionComponent<NotifyPropsI> = props => {
  const { mode, onClose, onChange } = props;

  const onClick = (): void => {
    if (mode === "successed" && onClose) onClose();
    else
      checkDicomParseProgress()
        .then(res => {
          onChange && onChange(res);
        })
        .catch(err => {
          console.error("pull parsing count error: ", err);
        });
  };

  return (
    <div className={`notify ${mode === "parsing" ? "notify-parsing" : ""}`}>
      <i className="iconfont iconic_tishi"></i>
      <span className="notify-text">{props.children}</span>
      <i
        className={`iconfont ${mode === "parsing" ? "iconic_shuaxin" : "iconic_guanbi"}`}
        onClick={onClick}
      ></i>
    </div>
  );
};

export default Notify;
