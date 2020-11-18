import { WalletOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space, Statistic, Tag } from "antd";
import React, { FunctionComponent, useState } from "react";
import QrcodeGenerator from "qrcode.react";
import useProd from "_hooks/useProd";

import "./style.less";
import { createOrder } from "_api/order";
import useAccount from "_hooks/useAccount";
import { getOrderWechatPayQrcode } from "_api/pay";

interface ScorePropsI {
  onSuccessed?: Function;
  onFailed?: (err: string) => void;
}

const TAGS_NUM = [1000, 3000, 5000];

const Score: FunctionComponent<ScorePropsI> = (props) => {
  const { account } = useAccount();
  const [qrcode, setQrcode] = useState<string>(""); // 支付二维码
  const [preScore, setPreScore] = useState(""); // 待充值的积分
  const [loading, setLoading] = useState(false);
  const { getProdList } = useProd();

  const onClick = (): void => {
    setLoading(true);
    getProdList()
      .then((res) => {
        const scoreProd = res.find((item) => item.code === "SCORE");
        if (!scoreProd) throw new Error("没有此商品");

        console.log("scoreProd", scoreProd);

        // return createOrder({
        //   owner_id: account.id,
        //   products: [{ id: scoreProd.id, amount: parseInt(preScore, 10) }],
        // });
      })
      // .then((res) => {
      //   const { order_number } = res;
      //   return getOrderWechatPayQrcode(order_number);
      // })
      // .then((res) => {
      //   setQrcode(res);
      // })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <section className="profile-score">
      <header className="header">
        <Card className="card">
          <Statistic title="积分余额" value={account.score} prefix={<WalletOutlined />}></Statistic>
        </Card>
      </header>
      <div className="content">
        <div className="input">
          <div className="input-title">积分充值：</div>
          <span>即将上线，敬请期待...</span>
          {/* <Input
            type="number"
            value={preScore}
            onChange={(e): void => {
              const { value } = e.target;
              if (value) setPreScore(`${parseInt(value, 10)}`);
              else setPreScore(value);
            }}
          ></Input> */}
        </div>
        {/* <div className="tags">
          <div className="tags-title">快速选择积分：</div>
          <div className="tags-content">
            {TAGS_NUM.map((num) => (
              <Tag
                className="tags-item"
                key={`score_tag_${num}`}
                onClick={(): void => setPreScore(`${num}`)}
                color="blue"
              >
                {num}
              </Tag>
            ))}
          </div>
        </div>
        <Button type="ghost" onClick={onClick} loading={loading}>
          获取充值二维码
        </Button>
        {qrcode ? (
          <Space direction="vertical">
            <QrcodeGenerator value={qrcode} size={256}></QrcodeGenerator>
            <span>扫码支付获取积分</span>
          </Space>
        ) : null} */}
      </div>
    </section>
  );
};

export default Score;
