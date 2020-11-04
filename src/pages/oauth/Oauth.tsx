import React, { FunctionComponent, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import getQueryString from "_helper";
import useAccount from "_hooks/useAccount";

const Oauth: FunctionComponent = () => {
  const history = useHistory();
  const query = getQueryString();
  const { wechatLogin } = useAccount();

  const { code } = query;
  // if (process.env.NODE_ENV === "development") return null;

  useEffect(() => {
    if (code) {
      wechatLogin(query)
        .then(() => {
          history.push("/resources");
        })
        .catch((err) => console.error(err));
    } else {
      console.log("no code");
    }
  }, []);

  return (
    <div className="login-redirect">
      页面即将跳转，如长时间未跳转，请手动点击<Link to="/login">登录</Link>
    </div>
  );
};

export default Oauth;
