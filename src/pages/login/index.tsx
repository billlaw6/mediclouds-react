/* 
  TODO LIST

  - 表单验证
  - 表单登录逻辑
  - 短信验证逻辑
  - 机器人验证码
  - 样式调整


*/

import React, { FunctionComponent, useState } from "react";

import LoginBtn from "./LoginBtn";

import logo from "_images/logo.png";
import welcome from "_assets/videos/welcome.mp4";

import Personal from "./Personal";
import Business from "./Business";

import "./style.less";

const Login: FunctionComponent = () => {
  const [type, setType] = useState<"personal" | "business">("personal"); // 切换登录类型
  const isPersonalType = type === "personal";

  return (
    <>
      <div className="login">
        <div className="login-spinner">
          <video className="login-show" src={welcome} autoPlay loop></video>
        </div>
        <div className="login-content">
          <img className="login-logo" src={logo} alt="logo" />
          {isPersonalType ? <Personal></Personal> : <Business></Business>}

          <LoginBtn onClick={(val): void => setType(val)} type={type}></LoginBtn>
        </div>
      </div>
    </>
  );
};

export default Login;
