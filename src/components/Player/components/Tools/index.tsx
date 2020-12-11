import {
  BackwardOutlined,
  BgColorsOutlined,
  CaretRightOutlined,
  DragOutlined,
  ForwardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PauseOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import React, { FunctionComponent } from "react";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { WindowI } from "_components/Player/types/window";
import ToolsItem from "./Item";

import "./style.less";

const Tools: FunctionComponent = () => {
  const { getFocusWindow, pause, play, next, prev, resetWindowImage } = useWindows();
  const {
    showLeftPan,
    showRightPan,
    switchPan,
    movingMode,
    switchMovingMode,
    scaleMode,
    switchScaleMode,
    wwwcMode,
    switchWwwcMode,
  } = useStatus();

  const { isPlay, data, frame } = getFocusWindow() || ({} as WindowI);
  const disabled = !data || !data.cache;

  const toolItemClassNameWithDisabled = `tools-item${disabled || frame < 0 ? " disabled" : ""}`;

  return (
    <div id="tools" className="tools">
      <article className="tools-left">
        <ToolsItem title="显示/隐藏左边栏">
          <MenuUnfoldOutlined
            className={`tools-item${showLeftPan ? " active reverse" : ""}`}
            onClick={(): void => switchPan("left", !showLeftPan)}
          />
        </ToolsItem>
        <ToolsItem title="移动">
          <DragOutlined
            className={`${toolItemClassNameWithDisabled}${movingMode ? " active" : ""}`}
            onClick={() => switchMovingMode(!movingMode)}
          />
        </ToolsItem>
        <ToolsItem title="缩放">
          <ZoomInOutlined
            className={`${toolItemClassNameWithDisabled}${scaleMode ? " active" : ""}`}
            onClick={() => switchScaleMode(!scaleMode)}
          />
        </ToolsItem>
        <ToolsItem title="调窗">
          <BgColorsOutlined
            className={`${toolItemClassNameWithDisabled}${wwwcMode ? " active" : ""}`}
            onClick={() => switchWwwcMode(!wwwcMode)}
          />
        </ToolsItem>
        <ToolsItem title="还原">
          <UndoOutlined
            className={toolItemClassNameWithDisabled}
            onClick={(): void => resetWindowImage()}
          />
        </ToolsItem>
      </article>
      <article className="tools-right">
        <ToolsItem title="上一个图像">
          <BackwardOutlined
            className={toolItemClassNameWithDisabled}
            onClick={(): void => {
              !disabled && prev();
            }}
          />
        </ToolsItem>
        <ToolsItem title="播放/暂停">
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
        </ToolsItem>
        <ToolsItem title="下一个图像">
          <ForwardOutlined
            className={toolItemClassNameWithDisabled}
            onClick={(): void => {
              !disabled && next();
            }}
          />
        </ToolsItem>
        <ToolsItem title="显示/隐藏右边栏">
          <MenuFoldOutlined
            className={`tools-item${showRightPan ? " active reverse-right" : ""}`}
            onClick={(): void => switchPan("right", !showRightPan)}
          />
        </ToolsItem>
        <ToolsItem title="帮助">
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
                    <li>方向键（左）：上一个图像</li>
                    <li>方向键（右）：下一个图像</li>
                    <li>鼠标滚轮： 上一个/下一个图像</li>

                    <li>按住Z键 + 鼠标上下拖动：缩放图像</li>
                    <li>按住X键： 移动图像</li>
                    <li>按住A键： 调窗</li>

                    <li>R键：还原</li>
                  </ul>
                ),
              });
            }}
          />
        </ToolsItem>
      </article>
    </div>
  );
};

export default Tools;
