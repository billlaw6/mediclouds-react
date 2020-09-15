/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { getPrivacyNotice, agreePrivacyNotice } from "_api/user";
import { setUserAction } from "_actions/user";

import { PrivacyNoticePropsI } from "./type";
import "./PrivacyNotice.less";

const PrivacyNotice: FunctionComponent<PrivacyNoticePropsI> = (props) => {
  const { user, onChecked } = props;

  const { privacy_notice = 0 } = user;

  const [checkWarn, setCheckWarn] = useState(false); // 当未选中同意时，点击确定 提醒
  const [check, setCheck] = useState(false); // 是否勾选同意
  const [privacyNoticeContent, setPrivacyNoticeContent] = useState(""); // 隐私协议内容
  const [privacyNotice, setPrivacyNotice] = useState(privacy_notice); // 隐私协议版本
  const [show, setShow] = useState(true); // 是否显示modal窗

  const dispatch = useDispatch();

  useEffect(() => {
    getPrivacyNotice()
      .then((result) => {
        const { id, content } = result;
        if (id) setPrivacyNotice(id);
        // 在useEffect外才能看见结果
        // console.log(privacyNotice);
        if (content) setPrivacyNoticeContent(content);
      })
      .catch((error) => console.error(error));
  }, []);

  // 更新用户隐私声明
  function updatePrivacyNotice(): void {
    if (!check) {
      setCheckWarn(true);
    } else {
      // something
      /* =========== 这里应当返回成功以后再执行 先放到finally内 后删 ============= */
      agreePrivacyNotice({ privacy_notice_id: privacyNotice }).then(
        (res): void => {
          // console.log("successed", res);
          dispatch(setUserAction(Object.assign({}, user, { privacy_notice: privacyNotice })));
          setShow(false);
          onChecked && onChecked();
        },
        (err) => {
          setShow(false);
          console.error(err);
        },
      );
      //   .catch(error => console.error(error));
      /* =========== 这里应当返回成功以后再执行 先放到finally内 后删 ============= */
      // agreePrivacyNoticeAction({ privacy_notice_id: privacyNotice });
      // setShow(false);
      // onChecked && onChecked();
    }
  }

  if (!privacy_notice || privacyNotice !== privacy_notice)
    return (
      <Modal
        className="privacy-notice"
        title="用户协议"
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
        <iframe
          className="privacy-notice-content"
          marginWidth={0}
          src="https://mi.mediclouds.cn/mc-privacy-notice/"
        ></iframe>
      </Modal>
    );

  return null;
};

export default PrivacyNotice;
