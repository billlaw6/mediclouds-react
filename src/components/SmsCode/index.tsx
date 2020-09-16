import React, { FunctionComponent, useState, useEffect } from "react";
import { FormItemProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import { Input } from "antd";
import { getSmsCode } from "_api/user";

interface CellPhoneCodePropsI extends FormItemProps {
  loginType: "form" | "phone";
  captcha?: string;
  cell_phone?: string;
}

let timer = -1;

const SmsCode: FunctionComponent<CellPhoneCodePropsI> = (props) => {
  const { loginType, captcha, cell_phone, className, ...others } = props;
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
      className={`login-auth-code ${className}`}
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
              if (countdown >= 0 || !cell_phone) return;
              getSmsCode({ cell_phone, captcha })
                .then((res) => {
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

export default SmsCode;
