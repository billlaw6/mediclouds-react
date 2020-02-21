/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent, useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "antd";
import { getPrivacyNotice, agreePrivacyNotice } from "_services/user";
// import { connect } from "react-redux";
// import { StoreStateI } from "_constants/interface";
// import { MapStateToPropsI } from "./type";

import "./PrivacyNotice.less";
import { PrivacyNoticePropsI } from "./type";
import { setUserAction } from "_actions/user";

const PrivacyNotice: FunctionComponent<PrivacyNoticePropsI> = props => {
  const { user, onChecked } = props;
  console.log("User: ", user);
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
        (res): void => {
          console.log("successed", res);
          setUserAction(Object.assign({}, user, { privacy_notice: privacyNotice }));
          setShow(false);
          onChecked && onChecked();
        },
        err => {
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

// export default PrivacyNotice;
// const mapStateToProps = (state: StoreStateI): MapStateToPropsI => {
//   // console.log(state);
//   return {
//     router: state.router,
//     user: state.user,
//   };
// };

export default PrivacyNotice;
