import React, { FunctionComponent, useEffect, useState } from "react";
import { Carousel } from "antd";

import img1 from "_images/login-spinner-1.png";
import img2 from "_images/login-spinner-2.png";
import img3 from "_images/login-spinner-3.png";

import logo from "_images/logo.png";
import wechatScan from "_images/wechat-scan.png";
import welcome from "_assets/videos/welcome.mp4";

import "./Login.less";
import { MapStateToPropsI, MapDispatchToPropsI } from "./type";
import Footer from "_components/Footer/Footer";

const APPID = "wxed42db352deaa115";
const REDIRECT_URL = "https://mi.mediclouds.cn/oauth/";

const Login: FunctionComponent<MapStateToPropsI & MapDispatchToPropsI> = (props) => {
  const [hiddenScan, setHiddenScan] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  const qrcodeURL =
    `https://open.weixin.qq.com/connect/qrconnect?` +
    `appid=${APPID}&` +
    `scope=snsapi_login&` +
    `redirect_uri=${encodeURI(REDIRECT_URL)}&` +
    `state=STATUS&` +
    `login_type=jssdk&` +
    `self_redirect=false&` +
    `styletype=&` +
    `sizetype=L&` +
    `bgcolor=black&` +
    `rst=&` +
    `style=&` +
    `href=` +
    "https://mi.mediclouds.cn/web/static/css/qrcode.css" +
    "&" +
    `response_type=code&` +
    `#wechat_redirect`;

  return (
    <>
      <div className="login">
        <div className="login-spinner">
          <video className="login-show" src={welcome} autoPlay loop></video>
          {/* <Carousel autoplay effect="fade">
          <div>
            <div className="login-spinner-item" style={{ backgroundImage: `url(${img1})` }}></div>
          </div>
          <div>
            <div className="login-spinner-item" style={{ backgroundImage: `url(${img2})` }}></div>
          </div>
          <div>
            <div className="login-spinner-item" style={{ backgroundImage: `url(${img3})` }}></div>
          </div>
        </Carousel> */}
        </div>
        <div className="login-content">
          <img className="login-logo" src={logo} alt="logo" />
          <span className="login-content-title">微信登录</span>
          <div className={`login-content-imgs ${hiddenScan ? "hidden" : ""}`}>
            <iframe
              id="wechatQrcode"
              title="WeChatLogin"
              src={qrcodeURL}
              scrolling="no"
              width="200px"
              height="200px"
            />
            <img src={wechatScan} alt="wechat-scan" />
          </div>
          <span className="login-content-tip">
            <i className="iconfont iconic_WeChat"></i>
            <span>打开微信，扫一扫登录</span>
          </span>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Login;
