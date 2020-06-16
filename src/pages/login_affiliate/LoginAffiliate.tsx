import React, { FunctionComponent } from "react";
import { getQueryString } from "_helper";

import "./LoginAffiliate.less";

const LoginAffiliate: FunctionComponent = () => {
  const params = getQueryString();

  const APPID = "wxed42db352deaa115";
  const REDIRECT_URL = "https://mi.mediclouds.cn/oauth-affiliate/";

  const { id = "STATUS" } = params;

  const qrcodeURL =
    `https://open.weixin.qq.com/connect/qrconnect?` +
    `appid=${APPID}&` +
    `scope=snsapi_login&` +
    `redirect_uri=${encodeURI(REDIRECT_URL)}&` +
    `state=${id}&` + // 替换用户ID
    `login_type=jssdk&` +
    `self_redirect=false&` +
    `styletype=&` +
    `sizetype=L&` +
    `bgcolor=black&` +
    `rst=&` +
    // `style=&` +
    // `href=` +
    // "https://mi.mediclouds.cn/web/static/css/qrcode.css" +
    "&" +
    `response_type=code&` +
    `#wechat_redirect`;

  return (
    <div className="login-affiliate">
      <iframe
        id="wechatQrcode"
        title="WeChatLogin"
        src={qrcodeURL}
        scrolling="no"
        width="200px"
        height="200px"
      />
    </div>
  );
};

export default LoginAffiliate;
