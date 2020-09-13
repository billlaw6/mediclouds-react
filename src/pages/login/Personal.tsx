import React, { FunctionComponent, useState, useEffect } from "react";
import wechatScan from "_images/wechat-scan.png";
// import { Form, Input, Button } from "antd";

// import Captcha from "./Captcha";
// import useAccount from "_hooks/useAccount";
// import LoginBtn from "./LoginBtn";

// const { Password: InputPassword } = Input;
// const { Item: FormItem } = Form;

import "./personal.less";

const APPID = "wxed42db352deaa115";
const WECHAT_URL = "https://open.weixin.qq.com/connect/qrconnect";
const REDIRECT_URL = "https://mi.mediclouds.cn/oauth/";
const STYLE_URL = "https://mi.mediclouds.cn/web/static/css/qrcode.css";

const QRCODE_URL =
  WECHAT_URL +
  `?appid=${APPID}&` +
  `scope=snsapi_login&` +
  `redirect_uri=${encodeURI(REDIRECT_URL)}&` +
  `state=STATUS&` + // 替换用户ID
  `login_type=jssdk&` +
  `self_redirect=false&` +
  `styletype=&` +
  `sizetype=L&` +
  `bgcolor=black&` +
  `rst=&` +
  `style=&` +
  `href=` +
  STYLE_URL +
  "&" +
  `response_type=code&` +
  `#wechat_redirect`;

const Personal: FunctionComponent = () => {
  const [hiddenScan, setHiddenScan] = useState(false);
  // const [loginType, setLoginType] = useState<"qrcode" | "form">("qrcode");
  // const [captcha, stCaptcha] = useState("");
  // const { devFormLogin } = useAccount();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="login-personal">
      <div className={`login-personal-qrcode ${hiddenScan ? "hidden" : ""}`}>
        <iframe
          id="wechatQrcode"
          title="WeChatLogin"
          src={QRCODE_URL}
          scrolling="no"
          width="200px"
          height="200px"
        />
        <img src={wechatScan} alt="wechat-scan" />
      </div>
      <span className="login-personal-tip">
        <i className="iconfont iconic_WeChat"></i>
        <span>打开微信，扫一扫登录</span>
      </span>
    </div>
  );
};

export default Personal;
