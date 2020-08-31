/* 
  TODO LIST

  - 表单验证
  - 表单登录逻辑
  - 短信验证逻辑
  - 机器人验证码
  - 样式调整


*/

import React, { FunctionComponent, useState, useEffect } from "react";
import { Tabs, Form, Button, Input } from "antd";
import Footer from "_components/Footer/Footer";

import LoginBtn from "./LoginBtn";
import useAccount from "_hooks/useAccount";

import logo from "_images/logo.png";
import wechatScan from "_images/wechat-scan.png";
import welcome from "_assets/videos/welcome.mp4";

import "./style.less";
import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI, AccountI } from "_types/account";
import { useHistory } from "react-router";

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
  const history = useHistory();
  const [type, setType] = useState<"personal" | "business">("personal"); // 切换登录类型
  const [loginType, setLoginType] = useState<"form" | "phone">("form"); // 切换表单登录类型
  const [loginFormData, setLoginFormData] = useState<any>({}); // 登录表单数据
  const { formLogin, phoneLogin } = useAccount();

  const [hiddenScan, setHiddenScan] = useState(false);

  const { user, account } = useSelector<
    StoreStateI,
    { user: UserI; account: AccountI & { login: boolean } }
  >((state) => ({
    user: state.user,
    account: state.account,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
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
                      rules={[{ required: loginType === "form", message: "请输入用户名" }]}
                    >
                      <Input value={loginFormData["username"] || ""}></Input>
                    </FormItem>
                    <FormItem
                      label="密码"
                      name="password"
                      rules={[{ required: loginType === "form", message: "请输入密码" }]}
                    >
                      <InputPassword value={loginFormData["password"] || ""}></InputPassword>
                    </FormItem>
                  </TabPane>
                  <TabPane key="phone" tab="手机号登录">
                    <FormItem
                      label="手机号"
                      name="cellphoneNumber"
                      rules={[{ required: loginType === "phone", message: "请输入手机号" }]}
                    >
                      <Input value={loginFormData["username"] || ""}></Input>
                    </FormItem>
                    <FormItem
                      label="验证码"
                      name="cellPhoneAuthCode"
                      rules={[{ required: loginType === "phone", message: "请输入验证码" }]}
                    >
                      <Input
                        value={loginFormData["cellPhoneAuthCode"] || ""}
                        addonAfter={<Button>点击获取验证码</Button>}
                      ></Input>
                    </FormItem>
                  </TabPane>
                </Tabs>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      if (loginType === "form") {
                        formLogin().then(
                          () => console.log("form login successed"),
                          (err: any) => console.error(err),
                        );
                      }
                      if (loginType === "phone") {
                        phoneLogin().then(
                          () => console.log("phone login successed"),
                          (err) => console.error(err),
                        );
                      }
                    }}
                  >
                    登录
                  </Button>
                </FormItem>
              </Form>
            </div>
          )}

          <LoginBtn onClick={(val): void => setType(val)} type={type}></LoginBtn>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Login;
