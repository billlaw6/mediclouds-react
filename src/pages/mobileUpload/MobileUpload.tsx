import React, { useState, FunctionComponent, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDicom_OLD } from "mc-api";

import { UploadStatusI } from "./type";
import FileProgress from "_components/FileProgress/FileProgress";

import { useDispatch } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { UploaderStatusE } from "_types/api";
import { ResourcesActionE } from "_types/resources";

import "./MobileUpload.less";

const MobileUpload: FunctionComponent = () => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [currentLoad, updateCurrentLoad] = useState<UploadStatusI | undefined>(undefined);
  const [uploadList, updateLoadList] = useState<UploadStatusI[]>([]);
  const [reupdateMap, setReupdateMap] = useState(new Map<string, FormData>()); // 重新上传的Map

  // 更新上传列表
  const _updateLoadList = (item: UploadStatusI): void => {
    const { id, status } = item;
    const nextupLoadList = uploadList.map((sub) => {
      if (sub.id === id) {
        if (status === UploaderStatusE.FAIL) {
          item.progress = sub.progress;
        }

        return item;
      }
      return sub;
    });

    updateLoadList(nextupLoadList);
    updateCurrentLoad(undefined);
  };

  const upload = async (formData: FormData, progressInfo: UploadStatusI): Promise<void> => {
    const { id } = progressInfo;

    try {
      await uploadDicom_OLD(formData, (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        updateCurrentLoad(
          Object.assign({}, progressInfo, {
            progress: (loaded / total) * 100,
          }),
        );
      });

      dispatch({ type: ResourcesActionE.GET_EXAM_LIST });
      updateCurrentLoad(
        Object.assign({}, progressInfo, {
          progress: 100,
          status: UploaderStatusE.SUCCESS,
        }),
      );

      reupdateMap.get(id) && reupdateMap.delete(id);
    } catch (error) {
      updateCurrentLoad(
        Object.assign({}, progressInfo, {
          status: UploaderStatusE.FAIL,
        }),
      );
      setReupdateMap(reupdateMap.set(id, formData));
    }
  };

  const reload = (id: string): void => {
    const targetLoad = uploadList.find((item) => item.id === id);
    if (!targetLoad) return;
    const currentFormData = reupdateMap.get(id);
    if (!currentFormData) return;

    const currentLoadStatus = {
      ...targetLoad,
      progress: 0,
      status: UploaderStatusE.UPLOADING,
    };
    updateCurrentLoad(currentLoadStatus);
    upload(currentFormData, currentLoadStatus);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: (files) => {
      if (files && files.length) {
        const progressInfo: UploadStatusI = {
          id: `${uploadList.length}`,
          count: files.length,
          progress: 0,
          status: UploaderStatusE.UPLOADING,
        };

        const nextUploadList = [...uploadList, progressInfo];
        updateLoadList(nextUploadList);

        const formData = new FormData();
        files.map((item) => {
          formData.append("file", item);
        });
        formData.append("privacy", "0");
        upload(formData, progressInfo);
      }
    },
  });

  if (currentLoad && currentLoad.id) {
    _updateLoadList(currentLoad);
  }

  return (
    <section className="moblie-upload">
      <div className="moblie-upload-header">
        <h1>移动端影像上传</h1>
      </div>
      <div className="moblie-upload-content">
        <div {...getRootProps({ className: "moblie-upload-uploader" })}>
          <input
            className="moblie-upload-input"
            ref={ref}
            {...getInputProps({ name: "file", multiple: true })}
          />
          <InboxOutlined className="iconfont"></InboxOutlined>
          <p>点击打开文件管理器，选择DICOM文件上传</p>
          <p>（注意：目前系统不支持后缀为.zip，.rar，.7z等压缩包文件）</p>
          <small>医影系统会自动解析整理影像类型及序列分组</small>
        </div>
      </div>
      <div className="moblie-upload-list">
        {uploadList.map((item) => {
          const { id, ...others } = item;
          return (
            <FileProgress key={id} {...others} onReload={(): void => reload(id)}></FileProgress>
          );
        })}
      </div>
    </section>
  );
};

export default MobileUpload;
