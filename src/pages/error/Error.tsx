import React, { FunctionComponent } from "react";
import LinkButton from "_components/LinkButton/LinkButton";

import error404 from "_images/404.png";
import "./Error.less";

const Error: FunctionComponent = () => {
  return (
    <section className="error">
      <img src={error404} alt="404" />
      <p>很抱歉，您访问的页面找不到了</p>
      <LinkButton to="/">返回首页</LinkButton>
    </section>
  );
};

export default Error;
