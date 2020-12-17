import React, { FunctionComponent, useState, useEffect, ReactNode } from "react";
import { Button, Form, Input, Space } from "antd";
import SmsCode from "_components/SmsCode";

import wechatScan from "_images/wechat-scan.png";
import useAccount from "_hooks/useAccount";
import { clearLocalStorage, encrypt, getLocalStorage } from "_helper";

import "./personal.less";

const { Item: FormItem } = Form;

const APPID = "wxed42db352deaa115";
const WECHAT_URL = "https://open.weixin.qq.com/connect/qrconnect";
const REDIRECT_URL = "https://mi.mediclouds.cn/oauth/";
const STYLE_URL = "https://mi.mediclouds.cn/web/static/css/qrcode.css";

interface PersonalPropsI {
  loginType?: "authCode" | "qrcode" | "pwd"; // 是否以表单登录触发
  nav?: string; //  登录后跳转的页面
}

const Personal: FunctionComponent<PersonalPropsI> = (props) => {
  const { loginType: defaultLoginType = "qrcode", nav } = props;

  const { personalPhoneLogin, formLogin } = useAccount();
  const [hiddenScan, setHiddenScan] = useState(false);
  const [loginType, setLoginType] = useState<"authCode" | "qrcode" | "pwd">();
  const [loginFormData, setLoginFormData] = useState<any>({});
  const [captchaVal, setCaptchaVal] = useState<string>("");
  const [oauthState, setOauthState] = useState("STATE");

  const QRCODE_URL =
    WECHAT_URL +
    `?appid=${APPID}&` +
    `scope=snsapi_login&` +
    `redirect_uri=${encodeURI(REDIRECT_URL)}&` +
    `state=${oauthState}&` + // 替换用户ID
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

  useEffect(() => {
    const isShare = getLocalStorage("s");
    if (isShare) setOauthState(encrypt(isShare));

    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  const type = loginType || defaultLoginType;

  const onFinish = () => {
    // if (!captchaVal) return;
    clearLocalStorage("s");
    if (type === "authCode")
      personalPhoneLogin(loginFormData, nav || "/resources").then(
        () => console.log("phone login successed"),
        (err: any) => console.error(err),
      );

    if (type === "pwd")
      formLogin(loginFormData, nav || "/resources").catch((err) => console.error(err));
  };

  const getLoginContent = () => {
    switch (type) {
      case "authCode":
        return (
          <div className="login-personal-form">
            <Form
              onValuesChange={(vals) => {
                setLoginFormData(Object.assign({}, loginFormData, vals));
              }}
              onFinish={onFinish}
            >
              <FormItem
                label="手机号"
                name="cell_phone"
                rules={[{ required: true, message: "请输入手机号" }]}
              >
                <Input value={loginFormData["cell_phone"] || ""}></Input>
              </FormItem>
              <SmsCode loginType="phone" cell_phone={loginFormData["cell_phone"] || ""}></SmsCode>
              {/* <Captcha onChecked={(val): void => setCaptchaVal(val)}></Captcha> */}
              <FormItem>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        );
      case "pwd":
        return (
          <div className="login-personal-form">
            <Form
              onValuesChange={(vals) => {
                setLoginFormData(Object.assign({}, loginFormData, vals));
              }}
              onFinish={onFinish}
            >
              <FormItem
                label="用户名/手机号"
                name="username"
                rules={[{ required: true, message: "请输入用户名或手机号" }]}
              >
                <Input value={loginFormData["cell_phone"] || ""}></Input>
              </FormItem>
              <FormItem
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
              >
                <Input.Password value={loginFormData["password"] || ""}></Input.Password>
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        );
      default:
        return (
          <>
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
          </>
        );
    }
  };

  const getSwitchBtn = (): ReactNode => {
    const btns = {
      authCode: (
        <span
          key="loginByAuthCode"
          className="login-personal-switch"
          onClick={(): void => setLoginType("authCode")}
        >
          手机验证码登录
        </span>
      ),
      pwd: (
        <span
          key="loginByPwd"
          className="login-personal-switch"
          onClick={(): void => setLoginType("pwd")}
        >
          密码登录
        </span>
      ),
      wechatQrcode: (
        <span
          key="loginByWechatQrcode"
          className="login-personal-switch"
          onClick={(): void => setLoginType("qrcode")}
        >
          微信扫码登录
        </span>
      ),
    };

    let result: ReactNode = null;

    switch (type) {
      case "authCode":
        result = [btns.wechatQrcode, btns.pwd];
        break;
      case "pwd":
        result = [btns.wechatQrcode, btns.authCode];
        break;
      default:
        result = [btns.authCode, btns.pwd];
        break;
    }

    return <Space>{result}</Space>;
  };

  return (
    <div className="login-personal">
      {getLoginContent()}
      {getSwitchBtn()}
    </div>
  );
};

export default Personal;
