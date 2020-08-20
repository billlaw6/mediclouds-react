import React, { FunctionComponent, useState, useEffect } from "react";
import { Tabs, Form, Button, Input, Space } from "antd";
import Footer from "_components/Footer/Footer";

import logo from "_images/logo.png";
import wechatScan from "_images/wechat-scan.png";
import welcome from "_assets/videos/welcome.mp4";

import LoginBtn from "./LoginBtn";

import "./style.less";

const { Item: FormItem } = Form;
const { TabPane } = Tabs;
const { Password: InputPassword } = Input;

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

const Login: FunctionComponent = () => {
  const [type, setType] = useState<"personal" | "business">("personal"); // 切换登录类型
  const [loginType, setLoginType] = useState<"form" | "phone">("form"); // 切换表单登录类型
  const [loginFormData, setLoginFormData] = useState<any>({}); // 登录表单数据

  const [hiddenScan, setHiddenScan] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  console.log("loginFormData", loginFormData);

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
            <div className="login-personal">
              <div className={`login-content-imgs ${hiddenScan ? "hidden" : ""}`}>
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
              <span className="login-content-tip">
                <i className="iconfont iconic_WeChat"></i>
                <span>打开微信，扫一扫登录</span>
              </span>
            </div>
          ) : (
            <div className="login-business">
              <Form
                onValuesChange={(vals) => {
                  setLoginFormData(Object.assign({}, loginFormData, vals));
                }}
                name="form-login"
              >
                <Tabs
                  defaultActiveKey={loginType}
                  activeKey={loginType}
                  onChange={(val): void => {
                    setLoginFormData({});
                    setLoginType(val as "form" | "phone");
                  }}
                >
                  <TabPane key="form" tab="账号密码登录">
                    <FormItem
                      label="用户名"
                      name="username"
                      rules={[{ required: true, message: "请输入用户名" }]}
                    >
                      <Input value={loginFormData["username"] || ""}></Input>
                    </FormItem>
                    <FormItem
                      label="密码"
                      name="password"
                      rules={[{ required: true, message: "请输入密码" }]}
                    >
                      <InputPassword value={loginFormData["password"] || ""}></InputPassword>
                    </FormItem>
                  </TabPane>
                  <TabPane key="phone" tab="手机号登录">
                    <FormItem
                      label="用户名"
                      name="username"
                      rules={[{ required: true, message: "请输入用户名" }]}
                    >
                      <Input value={loginFormData["username"] || ""}></Input>
                    </FormItem>
                    <FormItem
                      label="验证码"
                      name="cellPhoneAuthCode"
                      rules={[{ required: true, message: "请输入验证码" }]}
                    >
                      <Input
                        value={loginFormData["cellPhoneAuthCode"] || ""}
                        addonAfter={<Button>点击获取验证码</Button>}
                      ></Input>
                    </FormItem>
                  </TabPane>
                </Tabs>
              </Form>
            </div>
          )}

          <div className="login-contorl">
            <Space>
              <LoginBtn onClick={(val): void => setType(val)} type={type}></LoginBtn>
              {isPersonalType ? null : (
                <Button type="primary" onClick={() => console.log("loginType", loginType)}>
                  登录
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Login;
