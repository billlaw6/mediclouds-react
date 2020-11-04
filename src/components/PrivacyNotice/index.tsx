/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { getPrivacyNotice, agreePrivacyNotice } from "_api/user";
// import { setUserAction } from "_actions/user";

import { PrivacyNoticePropsI } from "./type";
import "./style.less";
import useAccount from "_hooks/useAccount";

const PrivacyNotice: FunctionComponent<PrivacyNoticePropsI> = (props) => {
  const { account: user, updateAccount } = useAccount();
  const { onChecked } = props;

  const [checkWarn, setCheckWarn] = useState(false); // 当未选中同意时，点击确定 提醒
  const [check, setCheck] = useState(false); // 是否勾选同意
  const [version, setVersion] = useState(0); // 隐私协议版本
  const [show, setShow] = useState(false); // 是否显示modal窗

  const dispatch = useDispatch();

  useEffect(() => {
    getPrivacyNotice()
      .then((result) => {
        const { id } = result;

        if (id) setVersion(id);
        if (id !== user.privacy_notice) setShow(true);
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
      agreePrivacyNotice({ privacy_notice_id: version })
        .then(() => {
          return updateAccount({ privacy_notice: version });
          // dispatch(setUserAction(Object.assign({}, user, { privacy_notice: version })))
        })
        .then(() => {
          setShow(false);
          onChecked && onChecked();
        })
        .catch((err) => {
          setShow(false);
          console.error(err);
        });
    }
  }

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
};

export default PrivacyNotice;
