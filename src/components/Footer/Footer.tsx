import React, { ReactElement } from "react";
import { Layout, Icon } from "antd";

import "./Footer.less";

const { Footer: AntdFooter } = Layout;

const Footer = (): ReactElement => (
  <AntdFooter id="footer">
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      北京医影云医疗技术有限公司<Icon type="copyright"></Icon>2020
    </span>
    <span>
      <a href="#">《用户协议》</a>
    </span>
    <a href="http://beian.miit.gov.cn">京ICP备19054124号-1</a>
  </AntdFooter>
);

export default Footer;
