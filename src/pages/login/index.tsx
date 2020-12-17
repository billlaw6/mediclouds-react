/* 
  TODO LIST

  - 表单验证
  - 表单登录逻辑
  - 短信验证逻辑
  - 机器人验证码
  - 样式调整


*/

import React, { FunctionComponent, useEffect, useState } from "react";

import LoginBtn from "./LoginBtn";

import logo from "_images/logo.png";
import welcome from "_assets/videos/welcome.mp4";

import Personal from "./Personal";
import Business from "./Business";
import useUrlQuery from "_hooks/useUrlQuery";

import "./style.less";
import { clearLocalStorage, getLocalStorage } from "_helper";

interface UrlQueryI {
  b?: 1; // 是否以企业用户登录打开
  f?: 1; // 是否以表单登录打开
  nav?: string; // 登录后跳转的页面
}

const Login: FunctionComponent = () => {
  const { b, f, nav: queryNav } = useUrlQuery<UrlQueryI>();
  const defaultType = b ? "business" : "personal";
  const [type, setType] = useState<"personal" | "business">(defaultType); // 切换登录类型
  const [nav, setNav] = useState(queryNav);
  const [loginType, setLoginType] = useState<"authCode" | "qrcode" | "pwd">(
    f ? "authCode" : "qrcode",
  );

  useEffect(() => {
    const isShare = getLocalStorage("s");
    if (isShare) {
      const { nav, search } = JSON.parse(isShare);
      setType("personal");
      setNav(`${nav}${search}`);
    }
  }, []);

  const isPersonalType = type === "personal";

  return (
    <>
      <div className="login">
        <div className="login-spinner">
          <video className="login-show" src={welcome} autoPlay loop></video>
        </div>
        <div className="login-content">
          <img className="login-logo" src={logo} alt="logo" />
          {isPersonalType ? (
            <Personal loginType={loginType} nav={nav}></Personal>
          ) : (
            <Business></Business>
          )}

          <LoginBtn onClick={(val): void => setType(val)} type={type}></LoginBtn>
        </div>
      </div>
    </>
  );
};

export default Login;
