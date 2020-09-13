import React, { FunctionComponent, useState, useEffect, useCallback } from "react";
import { FormItemProps } from "antd/lib/form";
import { CaptchaI } from "_types/api";
import FormItem from "antd/lib/form/FormItem";
import { Input, Spin } from "antd";
import md5 from "blueimp-md5";
import { LoadingOutlined } from "@ant-design/icons";
import { getCaptcha } from "_api/user";

import "./captchaStyle.less";

export interface CaptchaPropsI extends FormItemProps {
  onChecked?: (val: string) => void;
}

const Captcha: FunctionComponent<CaptchaPropsI> = (props) => {
  const { onChecked, className, ...otherProps } = props;
  const [checked, setChecked] = useState<-1 | 0 | 1>(0);
  const [captcha, setCaptch] = useState<CaptchaI | null>(null);

  const fetchCaptcha = useCallback((): void => {
    if (captcha) setCaptch(null);

    getCaptcha()
      .then((res) => setCaptch(res))
      .catch((err) => console.error(err));
  }, [captcha]);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
    <FormItem
      className={`login-captcha ${className}`}
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
          const isChecked = md5(value.toLowerCase()) === captcha.code;
          setChecked(isChecked ? 1 : -1);

          isChecked && onChecked && onChecked(value);
        }}
        addonAfter={
          captcha ? (
            <img
              className="login-captcha-img"
              onClick={(): void => fetchCaptcha()}
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

export default Captcha;
