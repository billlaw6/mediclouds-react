import React, { FunctionComponent } from "react";
import { DragOutlined, UndoOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

import "./style.less";
import { Tooltip } from "antd";

interface FnsPropsI {
  isMove: boolean;
  onMove?: Function;
  onZoomIn?: Function;
  onZoomOut?: Function;
  onReset?: Function;
}

const Fns: FunctionComponent<FnsPropsI> = (props) => {
  const { isMove, onMove, onZoomIn, onZoomOut, onReset } = props;

  return (
    <div className="player-fns">
      <Tooltip title="拖动快捷键: 按住 Left Ctrl">
        <DragOutlined
          className={`player-fns-item${isMove ? " active" : ""}`}
          onClick={(): void => onMove && onMove()}
        />
      </Tooltip>
      <Tooltip title="放大快捷键: A">
        <ZoomInOutlined className="player-fns-item" onClick={(): void => onZoomIn && onZoomIn()} />
      </Tooltip>
      <Tooltip title="缩小快捷键: Z">
        <ZoomOutOutlined
          className="player-fns-item"
          onClick={(): void => onZoomOut && onZoomOut()}
        />
      </Tooltip>
      <Tooltip title="还原快捷键: R">
        <UndoOutlined className="player-fns-item" onClick={(): void => onReset && onReset()} />
      </Tooltip>
    </div>
  );
};

export default Fns;
