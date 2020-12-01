import { Result } from "antd";
import React, { FunctionComponent } from "react";

import customerServiceImg from "_images/customer-service.png";

import "./style.less";

const ErrMsg: FunctionComponent = () => {
  return (
    <div className="err-msg">
      <Result
        status="error"
        title="报告解析失败"
        subTitle={
          <span>
            一般发生AI检测失败的原因有多种，您可以加客服微信号：
            <b style={{ color: "#000" }}>Medimages</b> 进一步咨询！
          </span>
        }
        extra={<img src={customerServiceImg} width="100%"></img>}
      ></Result>
    </div>
  );
};

export default ErrMsg;
