import React, { FunctionComponent, useState, useEffect } from "react";
import { Button, Form, Input, Space } from "antd";
import SmsCode from "_components/SmsCode";

import wechatScan from "_images/wechat-scan.png";
import qqlogin from "_images/qqlogin.png";
import useAccount from "_hooks/useAccount";

import "./personal.less";
import Captcha from "./Captcha";

const { Item: FormItem } = Form;

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
  const { personalPhoneLogin } = useAccount();
  const [hiddenScan, setHiddenScan] = useState(false);
  const [loginType, setLoginType] = useState<"form" | "qrcode">("qrcode");
  const [loginFormData, setLoginFormData] = useState<any>({});
  const [captchaVal, setCaptchaVal] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  const onFinish = () => {
    // if (!captchaVal) return;

    personalPhoneLogin(loginFormData, "/resources").then(
      () => console.log("phone login successed"),
      (err: any) => console.error(err),
    );
  };

  return (
    <div className="login-personal">
      {loginType === "form" ? (
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
      ) : (
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
      )}
      <Space>
        <span
          className="login-personal-switch"
          onClick={(): void => setLoginType(loginType === "form" ? "qrcode" : "form")}
        >
          {loginType === "form" ? "微信扫码登录" : "手机号登录"}
        </span>
        <span>
          <img src={qqlogin}></img>
        </span>
      </Space>
    </div>
  );
};

export default Personal;
