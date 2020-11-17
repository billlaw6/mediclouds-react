import { WalletOutlined } from "@ant-design/icons";
import { Button, Space, Statistic } from "antd";
import React, { FunctionComponent } from "react";
import QrcodeGenerator from "qrcode.react";

import "./style.less";

interface ScorePropsI {
  value: number;
}

const Score: FunctionComponent<ScorePropsI> = (props) => {
  const { value = 0 } = props;

  return (
    <section className="profile-score">
      <header className="header">
        <Statistic title="积分余额" value={value} prefix={<WalletOutlined />}></Statistic>
      </header>
      <div className="content">
        {/* <Space direction="vertical">
          <QrcodeGenerator value="https://www.baidu.com" size={256}></QrcodeGenerator>
          <span>扫码支付获取积分</span>
        </Space> */}
      </div>
    </section>
  );
};

export default Score;
