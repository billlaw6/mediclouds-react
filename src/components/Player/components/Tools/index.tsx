import {
  BackwardOutlined,
  BgColorsOutlined,
  CaretRightOutlined,
  ColumnWidthOutlined,
  DragOutlined,
  ForwardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PauseOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
  ZoomInOutlined,
  EyeInvisibleOutlined,
  TableOutlined,
  AimOutlined,
  DownOutlined,
  CaretDownOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Modal, Tag } from "antd";
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { WWWC_PRESETS } from "_components/Player/Contents";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import { CstToolNameT } from "_components/Player/types/common";
import { WindowI } from "_components/Player/types/window";
import { useHistory } from "react-router";
import logo from "_images/logo.png";

import ToolsGroup from "./Group";
import ToolsItem from "./Item";
import "./style.less";
import useSettings from "_components/Player/hooks/useSettings";

const Tools: FunctionComponent = () => {
  const history = useHistory();
  const { cst, cs } = useData();
  const { getFocusWindow, pause, play, next, prev, resetWindowImage } = useWindows();
  const { switchTool, currentToolName, showExamInfo, switchExamInfo } = useStatus();
  const { switchPlayerVersion } = useSettings();
  const { isPlay, data, frame, element } = getFocusWindow() || ({} as WindowI);

  const [viewport, setViewport] = useState<any>();
  const [wwwcKey, setWwwcKey] = useState(""); // 当前窗宽窗位菜单key

  const disabled = !data || !data.cache;

  const isActiveMode = useCallback((name: CstToolNameT): boolean => name === currentToolName, [
    currentToolName,
  ]);
  const toolItemClassNameWithDisabled = `tools-item${disabled || frame < 0 ? " disabled" : ""}`;

  const switchToolInToolbar = useCallback(
    (name: CstToolNameT, status: boolean): void => {
      if (!cst || !element || disabled) return;

      if (!status) {
        cst.setToolPassiveForElement(element, name);
        switchTool("");
      } else {
        cst.setToolActiveForElement(element, name, { mouseButtonMask: 1 });
        switchTool(name);
      }
    },
    [cst, element, switchTool],
  );

  const onKeypress = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      switch (e.code) {
        case "KeyX":
          switchToolInToolbar("Pan", !isActiveMode("Pan"));
          break;
        case "KeyZ":
          switchToolInToolbar("Zoom", !isActiveMode("Zoom"));
          break;
        case "KeyC":
          switchToolInToolbar("Wwwc", !isActiveMode("Wwwc"));
          break;
        case "KeyA":
          switchToolInToolbar("Length", !isActiveMode("Length"));
          break;
        case "KeyS":
          switchToolInToolbar("McDragProbe", !isActiveMode("McDragProbe"));
          // switchToolInToolbar("DragProbe", !isActiveMode("DragProbe"));
          break;
        default:
          break;
      }
    },
    [isActiveMode, switchToolInToolbar, disabled],
  );

  const onImageRendered = (e: any) => {
    if (viewport) {
      const { windowCenter, windowWidth } = viewport.voi;

      const val = `${Math.round(windowCenter)}/${Math.round(windowWidth)}`;
      const filteredItem = WWWC_PRESETS.find((item) => {
        return item.value === val;
      });

      if (filteredItem) setWwwcKey(filteredItem.value);
      else setWwwcKey("");
    }

    setViewport(e.detail.viewport);
  };

  useEffect(() => {
    document.addEventListener("keypress", onKeypress);
    if (element) element.addEventListener("cornerstoneimagerendered", onImageRendered);

    return () => {
      document.removeEventListener("keypress", onKeypress);
      if (element) element.removeEventListener("cornerstoneimagerendered", onImageRendered);
    };
  }, [element, onKeypress]);

  return (
    <div id="tools" className="tools">
      <article className="tools-left">
        <ToolsItem title="返回资源列表">
          <ArrowLeftOutlined
            className="tools-item"
            style={{ marginRight: 0 }}
            onClick={(): void => {
              history.push("/resources");
            }}
          />
        </ToolsItem>

        <ToolsGroup>
          <ToolsItem title="移动">
            <DragOutlined
              className={`${toolItemClassNameWithDisabled}${isActiveMode("Pan") ? " active" : ""}`}
              onClick={() => switchToolInToolbar("Pan", !isActiveMode("Pan"))}
            />
          </ToolsItem>
          <ToolsItem title="缩放">
            <ZoomInOutlined
              className={`${toolItemClassNameWithDisabled}${isActiveMode("Zoom") ? " active" : ""}`}
              onClick={() => switchToolInToolbar("Zoom", !isActiveMode("Zoom"))}
            />
          </ToolsItem>
          <ToolsItem title="调窗">
            <span
              className={`${toolItemClassNameWithDisabled}${isActiveMode("Wwwc") ? " active" : ""}`}
            >
              <BgColorsOutlined
                onClick={() => switchToolInToolbar("Wwwc", !isActiveMode("Wwwc"))}
              />
              <Dropdown
                className="tools-item-dropdown"
                trigger={["click"]}
                overlay={
                  <Menu
                    selectedKeys={[wwwcKey]}
                    onClick={(info) => {
                      if (!viewport || !element || !cs) return;
                      const { key } = info;
                      let { windowWidth, windowCenter } = viewport.voi;

                      if (key === "DEFAULT") {
                        const imgInfo = cs.getImage(element);
                        windowWidth = imgInfo.windowWidth;
                        windowCenter = imgInfo.windowCenter;
                        setWwwcKey("");
                      } else {
                        const [_wc, _ww] = key.toString().split("/");
                        windowWidth = parseInt(_ww, 10);
                        windowCenter = parseInt(_wc, 10);
                        setWwwcKey(key.toString());
                      }

                      cs.setViewport(
                        element,
                        Object.assign({}, viewport, { voi: { windowWidth, windowCenter } }),
                      );
                    }}
                  >
                    {WWWC_PRESETS.map((item) => {
                      return <Menu.Item key={item.value}>{item.title}</Menu.Item>;
                    })}
                  </Menu>
                }
              >
                <CaretDownOutlined className="tools-item-dropdown-target" />
                {/* <DownOutlined className="tools-item-dropdown-target" /> */}
              </Dropdown>
            </span>
          </ToolsItem>
          <ToolsItem title="还原">
            <UndoOutlined
              className={toolItemClassNameWithDisabled}
              onClick={(): void => {
                !disabled && resetWindowImage();
                setWwwcKey("");
              }}
            />
          </ToolsItem>
        </ToolsGroup>

        <ToolsGroup>
          <ToolsItem title="长度测量">
            <ColumnWidthOutlined
              className={`${toolItemClassNameWithDisabled}${
                isActiveMode("Length") ? " active" : ""
              }`}
              onClick={() => switchToolInToolbar("Length", !isActiveMode("Length"))}
            />
          </ToolsItem>
          <ToolsItem title="探针">
            <AimOutlined
              className={`${toolItemClassNameWithDisabled}${
                isActiveMode("McDragProbe") ? " active" : ""
              }`}
              onClick={() => switchToolInToolbar("McDragProbe", !isActiveMode("McDragProbe"))}
              // className={`${toolItemClassNameWithDisabled}${
              //   isActiveMode("DragProbe") ? " active" : ""
              // }`}
              // onClick={() => switchToolInToolbar("DragProbe", !isActiveMode("DragProbe"))}
            />
          </ToolsItem>
          <ToolsItem title="插值渲染">
            <TableOutlined
              className={`${toolItemClassNameWithDisabled}${
                viewport && viewport.pixelReplication ? " active" : ""
              }`}
              onClick={(): void => {
                if (!viewport || !cs || !element) return;

                const nextViewport = {
                  ...viewport,
                  pixelReplication: !viewport.pixelReplication,
                };

                cs.setViewport(element, nextViewport);
                setViewport(nextViewport);
              }}
            />
          </ToolsItem>
          <ToolsItem title="隐藏信息">
            <EyeInvisibleOutlined
              className={`${toolItemClassNameWithDisabled}${showExamInfo ? "" : " active"}`}
              onClick={(): void => {
                !disabled && switchExamInfo(!showExamInfo);
              }}
            />
          </ToolsItem>
        </ToolsGroup>
        <ToolsGroup>
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
        </ToolsGroup>
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

                    <li>移动图像：X键/按住鼠标左键</li>
                    <li>缩放图像：Z键/按住鼠标中键上下拖动</li>
                    <li>调窗: C键/按住鼠标右键</li>

                    <li>测量: A键</li>
                    <li>探针: S键</li>

                    <li>还原：R键</li>
                  </ul>
                ),
              });
            }}
          />
        </ToolsItem>
        <ToolsItem title="关于">
          <InfoCircleOutlined
            className="tools-item"
            onClick={(): void => {
              Modal.info({
                title: "关于医影浏览器",
                content: (
                  <div className="tools-about">
                    <img src={logo}></img>
                    <span>版本：0.0.1 alpha</span>
                  </div>
                ),
              });
            }}
          />
        </ToolsItem>
      </article>
      <article className="tools-right">
        <Tag
          className="back-old-version"
          color="volcano"
          onClick={(): void => switchPlayerVersion(false)}
        >
          返回旧版播放器
        </Tag>
      </article>
    </div>
  );
};

export default Tools;
