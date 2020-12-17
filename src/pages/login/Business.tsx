import React, { FunctionComponent, useState } from "react";
import { Tabs, Input, Button, Form } from "antd";
import { FormLoginDataI, PhoneLoginDataI } from "_types/api";
import useAccount from "_hooks/useAccount";

import Captcha from "./Captcha";
import SmsCode from "_components/SmsCode";

const { TabPane } = Tabs;
const { Item: FormItem } = Form;
const { Password: InputPassword } = Input;

const Business: FunctionComponent = () => {
  const [loginType, setLoginType] = useState<"form" | "phone">("form"); // 切换表单登录类型
  const [loginFormData, setLoginFormData] = useState<any>({}); // 登录表单数据
  const [captchaVal, setCaptchaVal] = useState<string>(); // 验证码
  const { formLogin, phoneLogin } = useAccount();

  return (
    <div className="login-business">
      <Form
        onValuesChange={(vals) => {
          setLoginFormData(Object.assign({}, loginFormData, vals));
        }}
        name="form-login"
        labelCol={{ span: 6 }}
        onFinish={(vals): void => {
          // if (!captchaVal) return;

          if (loginType === "form") {
            const { username, password, captcha: _captcha } = vals as FormLoginDataI;

            formLogin(
              {
                username,
                password,
                captcha: _captcha,
              },
              "/manager",
            ).then(
              () => console.log("form login successed"),
              (err: any) => console.error(err),
            );
          }
          if (loginType === "phone") {
            const { cell_phone, auth_code, captcha: _captcha } = vals as PhoneLoginDataI;

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
            {/* {loginType === "form" ? (
              <Captcha onChecked={(val): void => setCaptchaVal(val)}></Captcha>
            ) : null} */}
          </TabPane>
          <TabPane key="phone" tab="手机号登录">
            <FormItem
              label="手机号"
              name="cell_phone"
              rules={[{ required: loginType === "phone", message: "请输入手机号" }]}
            >
              <Input value={loginFormData["cell_phone"] || ""}></Input>
            </FormItem>
            {/* {loginType === "phone" ? (
              <Captcha onChecked={(val): void => setCaptchaVal(val)}></Captcha>
            ) : null} */}
            {/* {captchaVal ? ( */}
            <SmsCode
              // captcha={captchaVal}
              loginType={loginType}
              cell_phone={loginFormData["cell_phone"] || ""}
            ></SmsCode>
            {/* ) : null} */}
          </TabPane>
        </Tabs>
        <FormItem>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default Business;
