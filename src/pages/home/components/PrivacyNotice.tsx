/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "antd";
import { getPrivacyNotice, agreePrivacyNotice } from "_services/user";
import { connect } from "react-redux";
import { StoreStateI } from "_constants/interface";

import "./PrivacyNotice.less";
import { PrivacyNoticePropsI, MapStateToPropsI, MapDispatchToPropsI } from "./type";
import { setUserAction } from "_actions/user";

const PrivacyNotice: FunctionComponent<PrivacyNoticePropsI> = props => {
  const { user, onChecked, setUserAction } = props;
  const { privacy_notice = 0 } = user;

  const [checkWarn, setCheckWarn] = useState(false); // 当未选中同意时，点击确定 提醒
  const [check, setCheck] = useState(false); // 是否勾选同意
  const [privacyNoticeContent, setPrivacyNoticeContent] = useState(""); // 隐私协议内容
  const [privacyNotice, setPrivacyNotice] = useState(privacy_notice); // 隐私协议版本
  const [show, setShow] = useState(true); // 是否现实modal窗

  useEffect(() => {
    getPrivacyNotice()
      .then(result => {
        const { id, content } = result.data;
        console.log(id);
        if (id) setPrivacyNotice(id);
        // 在useEffect外才能看见结果
        // console.log(privacyNotice);
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
      console.log(privacyNotice);
      agreePrivacyNotice({ privacy_notice_id: privacyNotice }).then(
        (res: any): void => {
          // console.log(res);
          setUserAction(Object.assign({}, user, { privacy_notice: privacyNotice }));
          setShow(false);
          onChecked && onChecked();
        },
        err => {
          setShow(false);
          console.error(err);
        },
      );
    }
  }

  console.log("privacy_notice", privacy_notice);
  console.log("privacyNotice", privacyNotice);
  console.log("privacyNoticeContent", privacyNoticeContent);
  if (privacyNoticeContent && (!privacy_notice || privacyNotice !== privacy_notice))
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

const mapStateToProps = (state: StoreStateI): MapStateToPropsI => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps: MapDispatchToPropsI = {
  setUserAction: setUserAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyNotice);
