import React, { FunctionComponent, useState, useEffect, useCallback, ReactNode } from "react";
import { Upload, Space } from "antd";
import { useDropzone } from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons";

import { UploaderCellI, UploaderStatusE } from "_types/api";
import { uploadResources } from "_api/resources";
import FileProgress from "_components/FileProgress/FileProgress";

import "./style.less";

interface UploaderPropsI {
  directory?: boolean;
  accept?: string;
  onChange?: (fileProgressCmp: ReactNode) => void; // 当上传列表改变时触发
}

/* 创建上传单元 */
const createUploadCell = (id: number, fileList: File[]): UploaderCellI => {
  const res: UploaderCellI = {
    id,
    count: fileList.length,
    progress: 0,
    status: UploaderStatusE.PRELOAD,
    files: fileList,
  };

  return res;
};

const Uploader: FunctionComponent<UploaderPropsI> = (props) => {
  const { directory, accept, onChange } = props;
  const [uploadList, setUploadList] = useState<UploaderCellI[]>([]); // 上传队列

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: (files) => {
      if (files && files.length) {
        const uploaderCell = createUploadCell(uploadList.length, files);
        setUploadList([...uploadList, uploaderCell]);
      }
    },
  });

  /**
   * 更新指定单元内容 并更新上传列表
   *
   * @param {number} id
   * @param {*} data
   */
  const updateCell = useCallback(
    (id: number, data: any): void => {
      const nextList = uploadList.map((item) => {
        if (item.id === id) {
          return Object.assign({}, item, data);
        }

        return item;
      });

      setUploadList(nextList);
    },
    [uploadList],
  );

  const getList = useCallback((): ReactNode => {
    return uploadList.map((cell) => {
      const { id, progress, status, count } = cell;

      return (
        <FileProgress
          key={`upload_file_${id}`}
          count={count}
          progress={progress}
          status={status}
          onReload={(): void =>
            updateCell(id, Object.assign({}, cell, { status: UploaderStatusE.PRELOAD }))
          }
        ></FileProgress>
      );
    });
  }, [updateCell, uploadList]);

  /**
   * 上传
   *
   * @param {UploaderCellI} cell
   */
  const upload = useCallback(
    (cell: UploaderCellI): void => {
      const { files, id } = cell;
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      updateCell(id, { status: UploaderStatusE.UPLOADING });

      uploadResources(formData, (progressEvent: ProgressEvent) => {
        const { total, loaded } = progressEvent;

        updateCell(id, {
          progress: (loaded / total) * 100,
        });
      })
        .then(() => {
          updateCell(id, {
            progress: 100,
            status: UploaderStatusE.SUCCESS,
          });
        })
        .catch((err) => {
          console.error(err);
          updateCell(id, {
            status: UploaderStatusE.FAIL,
          });
        });
    },
    [updateCell],
  );

  useEffect(() => {
    const preloadList = uploadList.filter((item) => item.status === UploaderStatusE.PRELOAD);

    if (preloadList.length) {
      // 如果有未上传的 执行上传
      preloadList.forEach((item) => upload(item));
    }

    onChange && onChange(uploadList.length ? getList() : null);
  }, [getList, onChange, upload, uploadList]);

  return (
    <div className="uploader">
      <div
        {...getRootProps({ className: "uploader-inner" })}
        onMouseOver={(): void => {
          /* HACK: Typescript not support webkitdirectory attribute */
          if (!directory) return;
          const $input = document.querySelector(".uploader-input");
          if ($input && !$input.getAttribute("webkitdirectory")) {
            $input.setAttribute("webkitdirectory", "true");
          }
        }}
      >
        <input
          className="uploader-input"
          {...getInputProps({ name: "file", multiple: true, accept })}
        />
        <Space align="center" direction="vertical">
          <UploadOutlined className="uploader-iconfont" />
          <p>拖拽文件、文件夹到此处上传</p>
          <p>暂不支持压缩文件</p>
        </Space>
      </div>
      {onChange ? null : <div className="uploader-list">{getList()}</div>}
    </div>
  );
};

export default Uploader;
