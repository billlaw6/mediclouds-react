/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect, useRef } from "react";
import { Modal, Button, Checkbox } from "antd";
import { CurrentUserI } from "_constants/interface";
import axios from "axios";
import { getPrivacyNotice } from "../../../services/user";

import "./PrivacyNotice.less";

interface PrivacyNoticePropsI {
  user: CurrentUserI;
  onChecked: Function;
}

const PrivacyNotice: FunctionComponent<PrivacyNoticePropsI> = props => {
  const { user, onChecked } = props;
  const { privacy_notice = 0 } = user;

  const [checkWarn, setCheckWarn] = useState(false); // 当未选中同意时，点击确定 提醒
  const [check, setCheck] = useState(false); // 是否勾选同意
  const [privacyNoticeContent, setPrivacyNoticeContent] = useState(""); // 隐私协议内容
  const [privacyNotice, setPrivacyNotice] = useState(privacy_notice); // 隐私协议版本
  const [show, setShow] = useState(true); // 是否现实modal窗

  useEffect(() => {
    // axios
    //   .get("http://115.29.148.227:8083/rest-api/user/privacy-notice/")
    getPrivacyNotice()
      .then(result => {
        const { id, content } = result.data;
        if (id) setPrivacyNotice(id);
        if (content) setPrivacyNoticeContent(content);
      })
      .catch(error => console.error(error));
  }, []);

  // 更新用户隐私声明
  function updatePrivacyNotice(): void {
    if (!check) {
      setCheckWarn(true);
    } else {
      // something
      /* =========== 这里应当返回成功以后再执行 先放到finally内 后删 ============= */
      axios
        .post("#")
        // .post("http://115.29.148.227:8083/rest-api/user/update", { privacy_notice: privacyNotice })
        .then((result): void => {
          // setShow(false);
          // onChecked && onChecked();
        })
        .catch(error => console.error(error))
        .finally(() => {
          setShow(false);
          onChecked && onChecked();
        });
      /* =========== 这里应当返回成功以后再执行 先放到finally内 后删 ============= */
    }
  }

  if (!privacy_notice || privacyNotice !== privacy_notice)
    return (
      <Modal
        className="privacy-notice"
        title="隐私政策"
        visible={show}
        closable={false}
        footer={[
          <Checkbox
            className={`privacy-notice-check ${checkWarn ? "warning" : ""}`}
            key="agree"
            defaultChecked={false}
            onChange={(): void => {
              setCheck(!check);
              setCheckWarn(false);
            }}
          >
            本人已阅读并同意
          </Checkbox>,
          <Button
            className={`privacy-notice-comfrim ${check ? "" : "disabled"}`}
            key="confrim"
            onClick={updatePrivacyNotice}
          >
            确定
          </Button>,
        ]}
      >
        {privacyNoticeContent}
      </Modal>
    );
  return null;
};

export default PrivacyNotice;
