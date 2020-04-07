import React, { useState, FunctionComponent, useRef, useEffect } from "react";
import { Icon, Switch } from "antd";
import { useDropzone } from "react-dropzone";
import * as type from "_store/action-types";
import { baseURL } from "_services/api";
import axios from "axios";

import { UploadStatusI } from "./type";

import FileProgress from "_components/FileProgress/FileProgress";

import { Link } from "react-router-dom";
import { FileProgressStatusEnum } from "_components/FileProgress/type";

import "./Upload.less";
import { useDispatch } from "react-redux";
import { checkDicomTotalCount } from "_helper";
import wechatQrcode from "_images/wechat-qrcode.jpg";

const Upload: FunctionComponent = () => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const [currentLoad, updateCurrentLoad] = useState<UploadStatusI | undefined>(undefined);
  const [uploadList, updateLoadList] = useState<UploadStatusI[]>([]);
  const [delPrivacy, changeDelPrivacy] = useState(false);
  const [reupdateMap, setReupdateMap] = useState(new Map<string, FormData>()); // 重新上传的Map
  const [total, setTotal] = useState(0); // 所有上传的影像列表计数
  const [showTip, setShowTip] = useState(false); // 显示首次上传成功提示

  // 更新上传列表
  const _updateLoadList = (item: UploadStatusI): void => {
    const { id, status } = item;
    const nextupLoadList = uploadList.map((sub) => {
      if (sub.id === id) {
        if (status === FileProgressStatusEnum.FAIL) {
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
    const URL = baseURL + "dicom/upload/";
    try {
      const res = await axios.post(URL, formData, {
        // .post(`${axios.defaults.baseURL}dicom/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (progressEvent: any) {
          // console.log("progressEvent: ", progressEvent);
          const { loaded, total } = progressEvent;
          updateCurrentLoad(
            Object.assign({}, progressInfo, {
              progress: (loaded / total) * 100,
            }),
          );
          if (loaded === total && total <= 0) {
            // if (loaded === total && total > 0) {
            setTotal(progressInfo.count);
            setShowTip(true);
          }
        },
      });

      dispatch({ type: type.GET_EXAM_INDEX_LIST });
      updateCurrentLoad(
        Object.assign({}, progressInfo, {
          progress: 100,
          status: FileProgressStatusEnum.SUCCESS,
        }),
      );

      reupdateMap.get(id) && reupdateMap.delete(id);
    } catch (error) {
      updateCurrentLoad(
        Object.assign({}, progressInfo, {
          status: FileProgressStatusEnum.FAIL,
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
      status: FileProgressStatusEnum.PENDING,
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
          status: FileProgressStatusEnum.PENDING,
        };

        const nextUploadList = [...uploadList, progressInfo];
        updateLoadList(nextUploadList);

        const formData = new FormData();
        files.map((item) => {
          formData.append("file", item);
        });
        formData.append("privacy", delPrivacy ? "1" : "0");
        // console.log(formData);
        upload(formData, progressInfo);
      }
    },
  });

  // console.log("updateLoadList", uploadList);
  if (currentLoad && currentLoad.id) {
    _updateLoadList(currentLoad);
  }

  // 获取所有上传的dicom总量
  useEffect(() => {
    checkDicomTotalCount()
      .then((res) => {
        setTotal(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="upload">
      <div className="upload-header">
        <h1>上传</h1>
        <Link className="upload-back" to="/">
          <Icon className="iconfont" type="arrow-left" />
          <span>返回</span>
        </Link>
      </div>
      <div className="upload-content">
        <div
          {...getRootProps({ className: "upload-uploader" })}
          onMouseOver={(): void => {
            /* HACK: Typescript not support webkitdirectory attribute */
            const $input = document.querySelector(".upload-input");
            if ($input && !$input.getAttribute("webkitdirectory")) {
              $input.setAttribute("webkitdirectory", "true");
            }
          }}
        >
          <input
            className="upload-input"
            ref={ref}
            {...getInputProps({ name: "file", multiple: true })}
          />
          <Icon className="iconfont" type="inbox" />
          <p>将文件或文件夹拖拽到这里上传</p>
          <small>系统自动整理影像种类</small>
        </div>
        <article className="upload-ctl">
          <div className="upload-ctl-header">
            <span>删除隐私</span>
            <Switch
              checked={delPrivacy}
              onClick={(): void => changeDelPrivacy(!delPrivacy)}
            ></Switch>
          </div>
          <div className="upload-ctl-content">
            <p> 为了保护患者隐私,我们提供患者信息删除功能 </p>
            <ul>
              <li>· 开启隐私删除,将文件拖拽进来,系统将自动删除患者所有信息。</li>
              <li>· 影像删除后将无法找回，你可以重新上传影像来获取信息。</li>
            </ul>
          </div>
        </article>
      </div>
      <div className="upload-list">
        {uploadList.map((item) => {
          const { id, ...others } = item;
          return (
            <FileProgress key={id} {...others} onReload={(): void => reload(id)}></FileProgress>
          );
        })}
      </div>
      <div className={`upload-tip ${showTip ? "show" : ""}`}>
        <div className="upload-tip-content">
          <i
            className="iconfont iconic_close"
            onClick={(): void => {
              setShowTip(false);
            }}
          ></i>
          <img src={wechatQrcode} alt="wechat_qrcode" title="wechat-qrcode"></img>
          <p>您的影像已上传成功</p>
          <p>请打开微信“扫一扫”识别二维码</p>
        </div>
      </div>
    </section>
  );
};

export default Upload;
