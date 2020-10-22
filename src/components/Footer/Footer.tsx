import React, { ReactElement } from "react";
import { Layout } from "antd";
import { CopyrightCircleOutlined } from "@ant-design/icons";

import "./Footer.less";

const { Footer: AntdFooter } = Layout;

const Footer = (): ReactElement => (
  <AntdFooter id="footer" className="footer">
    <div className="footer-notice">本站内容仅供参考，不作为诊断及医疗依据</div>
    <div className="footer-info">
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        北京医影云医疗技术有限公司 <CopyrightCircleOutlined />
        2020
      </span>
      <span>
        <a
          href="https://mi.mediclouds.cn/mc-privacy-notice/"
          target="_blank"
          rel="noopener noreferrer"
        >
          《用户协议》
        </a>
      </span>
      <a href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
        京ICP备19054124号-1
      </a>
    </div>
  </AntdFooter>
);

export default Footer;
