import React, { FunctionComponent, ReactElement } from "react";
import { Progress, Space, Tooltip } from "antd";

import { Link } from "react-router-dom";
import { UploaderStatusE } from "_types/api";

import { FileProgressPropsI } from "./type";
import "./FileProgress.less";

const FileProgress: FunctionComponent<FileProgressPropsI> = (props) => {
  const {
    progress,
    status,
    filePath,
    failText = "加载失败",
    successText = "加载成功",
    pendingText = "上传中...",
    count,
    onReload,
    errFiles,
  } = props;

  const getStatusInfo = (): {
    resText: string;
    color: string;
    ctlCmp?: ReactElement;
    status: "normal" | "active" | "success" | "exception" | undefined;
  } => {
    switch (status) {
      case UploaderStatusE.SUCCESS:
        return {
          resText: successText,
          color: "#52C41A",
          ctlCmp: (
            <Link style={{ color: "#52C41A", cursor: "pointer" }} to="/" target="_blank">
              查看文件
            </Link>
          ),
          status: "normal",
        };
      case UploaderStatusE.FAIL:
        return {
          resText: failText,
          color: "#FF7633",
          ctlCmp: (
            <span
              style={{ color: "#FF7633", cursor: "pointer" }}
              onClick={(): void => onReload && onReload()}
            >
              重新加载
            </span>
          ),
          status: "normal",
        };
      default:
        return { resText: pendingText, color: "#7594FF", status: "active" };
    }
  };

  const { resText, color, ctlCmp, status: infoStatus } = getStatusInfo();

  return (
    <div className="file-progress">
      <div className="file-progress-content">
        <div className="file-progress-info file-progress-info-top">
          <span className="file-progress-title">文件加载</span>
          <span className="file-progress-path">{filePath}</span>
        </div>
        <Progress
          status={infoStatus}
          className="file-progress-line"
          type="line"
          percent={progress}
          strokeWidth={8}
          strokeColor={color}
          showInfo={false}
        ></Progress>
        <div className="file-progress-info file-progress-info-bottom">
          <Space>
            <span>文件数量：{count}</span>
            {errFiles ? (
              <Tooltip
                title={errFiles.map((item, index) => (
                  <span style={{ display: "block" }} key={`err_file_${index}`}>
                    {item}
                  </span>
                ))}
              >
                <span className="file-progress-err-files">发现{errFiles.length}个无效文件</span>
              </Tooltip>
            ) : null}
          </Space>
          <span style={{ color: color }}>{resText}</span>
        </div>
      </div>
      <div className="file-progress-ctl">{ctlCmp}</div>
    </div>
  );
};

export default FileProgress;
