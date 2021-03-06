import React, { FunctionComponent } from "react";
import { Button } from "antd";

interface LoginBtnPropsI {
  className?: string;
  type: "personal" | "business";
  onClick: (val: "personal" | "business") => void;
}

/**
 * 切换登录模式
 * @param {LoginBtnPropsI} props
 */
const LoginBtn: FunctionComponent<LoginBtnPropsI> = (props) => {
  const { onClick, type, className } = props;
  const isPersonalType = type === "personal";

  return (
    <Button
      className={`login-type${" " + className}`}
      onClick={(): void => onClick(isPersonalType ? "business" : "personal")}
    >
      {isPersonalType ? "企业用户登录" : "个人用户登录"}
    </Button>
  );
};

export default LoginBtn;
