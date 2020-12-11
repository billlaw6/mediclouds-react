import {
  BackwardOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PauseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import React, { FunctionComponent } from "react";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";
import Controller from "../Controller";

import "./style.less";

const Tools: FunctionComponent = () => {
  const { getFocusWindow, pause, play, next, prev } = useWindows();
  const { showLeftPan, showRightPan, switchPan } = useStatus();

  const { isPlay, data } = getFocusWindow() || ({} as WindowI);
  const disabled = !data || !data.cache;

  const toolItemClassNameWithDisabled = `tools-item${disabled ? " disabled" : ""}`;

  return (
    <div id="tools" className="tools">
      <div className="tools-left">
        <MenuUnfoldOutlined
          className={`tools-item${showLeftPan ? " active reverse" : ""}`}
          onClick={(): void => switchPan("left", !showLeftPan)}
        />
      </div>
      <div className="tools-right">
        <BackwardOutlined
          className={toolItemClassNameWithDisabled}
          onClick={(): void => {
            !disabled && prev();
          }}
        />
        {isPlay ? (
          <PauseOutlined
            className="tools-item active"
            onClick={(): void => {
              !disabled && pause();
            }}
          />
        ) : (
          <CaretRightOutlined
            className={toolItemClassNameWithDisabled}
            onClick={(): void => {
              !disabled && play();
            }}
          />
        )}
        <ForwardOutlined
          className={toolItemClassNameWithDisabled}
          onClick={(): void => {
            !disabled && next();
          }}
        />
        <MenuFoldOutlined
          className={`tools-item${showRightPan ? " active reverse-right" : ""}`}
          onClick={(): void => switchPan("right", !showRightPan)}
        />
        <QuestionCircleOutlined
          className="tools-item"
          onClick={(): void => {
            Modal.info({
              title: "快捷键",
              content: (
                <ul>
                  <li>空格：播放/暂停</li>
                  <li>方向键（上）：上一个序列</li>
                  <li>方向键（下）：下一个序列</li>
                  <li>方向键（左）：上一个图片</li>
                  <li>方向键（右）：下一个图片</li>
                </ul>
              ),
            });
          }}
        />
      </div>
    </div>
  );
};

export default Tools;
