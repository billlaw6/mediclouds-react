import { WalletOutlined } from "@ant-design/icons";
import { Alert, Button, Card, InputNumber, Space, Statistic, Tag } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import QrcodeGenerator from "qrcode.react";

import useAccount from "_hooks/useAccount";
import useOrder from "_hooks/useOrder";

import config from "_config";
import { OrderI } from "_types/order";
import { getOrderStatus } from "_api/order";

import "./style.less";
interface ScorePropsI {
  onSuccessed?: Function;
  onFailed?: (err: string) => void;
}

let timer = -1;
const TAGS_NUM = [1000, 3000, 5000];

const Score: FunctionComponent<ScorePropsI> = (props) => {
  const { onSuccessed } = props;
  const { account } = useAccount();
  const { buyScore } = useOrder();
  const [qrcode, setQrcode] = useState<string>(); // 支付二维码
  const [preScore, setPreScore] = useState(""); // 待充值的积分
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderI>(); // 当前的订单

  const onClick = (): void => {
    let _score = parseInt(preScore, 10);
    if (!_score) return;

    /** 大于1000积分触发充值优惠 */
    if (_score >= 1000) {
      _score = Math.ceil(_score * config.scoreDiscount);
    }

    setLoading(true);
    buyScore(_score)
      .then((res) => {
        const { qrcode, order } = res;
        setCurrentOrder(order);
        setQrcode(qrcode);
        setLoading(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (currentOrder) {
      timer = window.setInterval(() => {
        getOrderStatus(currentOrder.order_number).then((res) => {
          if (res > 0 && res < 3) {
            setCurrentOrder(undefined);

            onSuccessed && onSuccessed();
          }
        });
      }, 3000);
    } else {
      window.clearInterval(timer);
    }

    return () => window.clearInterval(timer);
  }, [currentOrder]);

  return (
    <section className="profile-score">
      <header className="header">
        <Card className="card">
          <Statistic title="积分余额" value={account.score} prefix={<WalletOutlined />}></Statistic>
        </Card>
      </header>
      <div className="content">
        <Space direction="vertical">
          <div className="input">
            <div className="input-title">积分充值：</div>
            {/* <span>即将上线，敬请期待...</span> */}
            <Space direction="vertical">
              <Alert
                message={
                  <span>
                    限时优惠：充值1000积分以上，<b style={{ color: "red" }}>充多少送多少！</b>
                  </span>
                }
                type="info"
                showIcon
              ></Alert>
              <InputNumber
                type="number"
                value={parseInt(preScore, 10) || 0}
                defaultValue={0}
                style={{ width: "100%" }}
                placeholder="输入金额，仅限整数"
                onChange={(value): void => {
                  setPreScore(`${value}`);
                }}
              ></InputNumber>
            </Space>
          </div>
          <div className="tags">
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
              <span style={{ color: "red" }}>扫码支付获取积分，支付完成请刷新页面查看积分变动</span>
            </Space>
          ) : null}
        </Space>
      </div>
    </section>
  );
};

export default Score;
