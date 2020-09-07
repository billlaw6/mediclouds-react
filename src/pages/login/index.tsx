/* 
  TODO LIST

  - 表单验证
  - 表单登录逻辑
  - 短信验证逻辑
  - 机器人验证码
  - 样式调整


*/

import React, { FunctionComponent, useState, useEffect, useCallback } from "react";
import { Tabs, Form, Button, Input, Spin } from "antd";
import md5 from "blueimp-md5";
import Footer from "_components/Footer/Footer";

import LoginBtn from "./LoginBtn";
import useAccount from "_hooks/useAccount";

import logo from "_images/logo.png";
import wechatScan from "_images/wechat-scan.png";
import welcome from "_assets/videos/welcome.mp4";

import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI, AccountI } from "_types/account";
import { useHistory } from "react-router";
import { getCaptcha, getSmsCode } from "_api/user";
import { CaptchaI, LoginPhoneDataI } from "_types/api";
import { LoadingOutlined } from "@ant-design/icons";
import { FormItemProps } from "antd/lib/form";

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

let timer = -1;

interface CaptchaPropsI extends FormItemProps {
  captcha?: CaptchaI | null;
  onRefreshCaptcha?: Function;
  onChecked?: (val: string) => void;
}

interface CellPhoneCodePropsI extends FormItemProps {
  loginType: "form" | "phone";
  captcha?: string;
  cell_phone?: string;
}

const CellPhoneCode: FunctionComponent<CellPhoneCodePropsI> = (props) => {
  const { loginType, captcha, cell_phone, ...others } = props;
  const [countdown, setCountdown] = useState(-1);

  useEffect(() => {
    if (countdown < 0 && timer) {
      return window.clearTimeout(timer);
    }

    const _tempCountdown = countdown;
    timer = window.setTimeout(() => {
      setCountdown(_tempCountdown - 1);
    }, 1000);
  }, [countdown]);

  return (
    <FormItem
      label="手机验证码"
      name="auth_code"
      rules={[{ required: loginType === "phone", message: "请输入验证码" }]}
      {...others}
    >
      <Input
        addonAfter={
          <span
            style={{ cursor: "pointer" }}
            onClick={(): void => {
              console.log("cell_phone, captcha", cell_phone, captcha, countdown);
              if (countdown >= 0 || !cell_phone || !captcha) return;
              getSmsCode({ cell_phone, captcha })
                .then((res) => {
                  console.log("get sms code", res);
                  setCountdown(60);
                })
                .catch((err) => console.error(err));
            }}
          >
            {countdown < 0 ? "获取手机验证码" : `（${countdown}s）后再次获取`}
          </span>
        }
      ></Input>
    </FormItem>
  );
};

const Captcha: FunctionComponent<CaptchaPropsI> = (props) => {
  const { captcha, onRefreshCaptcha, onChecked, ...otherProps } = props;
  const [checked, setChecked] = useState<-1 | 0 | 1>(0);

  return (
    <FormItem
      label="验证码"
      name="captcha"
      required
      hasFeedback={checked !== 0}
      help={checked === -1 ? "验证码错误" : ""}
      validateStatus={checked === -1 ? "error" : checked === 1 ? "success" : ""}
      {...otherProps}
    >
      <Input
        placeholder="点击图片更新"
        onInput={(e): void => {
          if (!captcha) return;

          const { value } = e.currentTarget;
          const isChecked = md5(value) === captcha.code;
          setChecked(isChecked ? 1 : -1);

          isChecked && onChecked && onChecked(value);
        }}
        addonAfter={
          captcha ? (
            <img
              className="login-captcha"
              onClick={(): void => onRefreshCaptcha && onRefreshCaptcha()}
              style={{ height: "32px", boxSizing: "border-box" }}
              src={captcha.image}
              alt="点击更新验证码"
            ></img>
          ) : (
            <Spin indicator={<LoadingOutlined />}></Spin>
          )
        }
      ></Input>
    </FormItem>
  );
};

const Login: FunctionComponent = () => {
  const history = useHistory();
  const [type, setType] = useState<"personal" | "business">("personal"); // 切换登录类型
  const [loginType, setLoginType] = useState<"form" | "phone">("form"); // 切换表单登录类型
  const [loginFormData, setLoginFormData] = useState<any>({}); // 登录表单数据
  const [captcha, setCaptch] = useState<CaptchaI | null>(null);
  const [captchaVal, setCaptchaVal] = useState<string>(); // 验证码的md5检查状态

  const { formLogin, phoneLogin } = useAccount();

  const [hiddenScan, setHiddenScan] = useState(false);

  const { user, account } = useSelector<
    StoreStateI,
    { user: UserI; account: AccountI & { login: boolean } }
  >((state) => ({
    user: state.user,
    account: state.account,
  }));

  const fetchCaptcha = (): void => {
    setCaptchaVal("");
    if (captcha) setCaptch(null);

    getCaptcha()
      .then((res) => setCaptch(res))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiddenScan(true);
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (type === "business") {
      fetchCaptcha();
    }
  }, [type, loginType]);

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
                labelCol={{ span: 6 }}
                onFinish={(vals): void => {
                  if (!captcha || !captchaVal) return;

                  const { cell_phone, auth_code, captcha: _captcha } = vals as LoginPhoneDataI;

                  if (loginType === "form") {
                    formLogin().then(
                      () => console.log("form login successed"),
                      (err: any) => console.error(err),
                    );
                  }
                  if (loginType === "phone") {
                    phoneLogin({ cell_phone, auth_code, captcha: _captcha }).then(
                      () => console.log("phone login successed"),
                      (err) => console.error(err),
                    );
                  }
                }}
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
                    <Captcha
                      captcha={captcha}
                      onRefreshCaptcha={fetchCaptcha}
                      onChecked={(val): void => setCaptchaVal(val)}
                    ></Captcha>
                  </TabPane>
                  <TabPane key="phone" tab="手机号登录">
                    <FormItem
                      label="手机号"
                      name="cell_phone"
                      rules={[{ required: loginType === "phone", message: "请输入手机号" }]}
                    >
                      <Input value={loginFormData["username"] || ""}></Input>
                    </FormItem>
                    <CellPhoneCode
                      captcha={captchaVal}
                      loginType={loginType}
                      cell_phone={loginFormData["cell_phone"] || ""}
                    ></CellPhoneCode>
                    <Captcha
                      captcha={captcha}
                      onRefreshCaptcha={fetchCaptcha}
                      onChecked={(val): void => setCaptchaVal(val)}
                    ></Captcha>
                  </TabPane>
                </Tabs>
                <FormItem>
                  <Button type="primary" htmlType="submit">
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
