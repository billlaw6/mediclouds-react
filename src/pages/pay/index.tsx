import React, { FunctionComponent, useEffect } from "react";
import { useHistory } from "react-router";
import useUrlQuery from "_hooks/useUrlQuery";

const WechatPay: FunctionComponent = () => {
  const history = useHistory();
  // const query = useUrlQuery<{ order_number: string; type: PayTypeE }>();

  // const { order_number, type } = query;

  // useEffect(() => {
  //   if (order_number && type) {
  //     pay({ order_number, type })
  //       .then((res) => (window.location.href = res))
  //       .catch((err) => console.error(err));
  //   }
  // }, [history, order_number, type]);

  // if (!order_number) return <div>订单号无效，请联系商家重新扫码</div>;

  // return (
  //   <div>
  //     正在发起支付请求，请稍等...
  //     {order_number}
  //     {type}
  //   </div>
  // );

  return <div>pay</div>;
};

export default WechatPay;
