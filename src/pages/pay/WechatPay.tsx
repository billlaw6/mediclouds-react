import React, { FunctionComponent } from "react";
import { useHistory, useParams } from "react-router";
import useUrlQuery from "_hooks/useUrlQuery";

const WechatPay: FunctionComponent = () => {
  const history = useHistory();
  const query = useUrlQuery<{ order_number: string }>();

  const { order_number } = query;

  if (!order_number) return <div>订单号无效，请联系商家重新扫码</div>;

  return <div>wechat pay</div>;
};

export default WechatPay;
