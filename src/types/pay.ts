/* 支付入口类型 */
export enum PayTypeE {
  WECHAT = "wechat", // 微信支付
  ALI = "ali", // 支付宝
}

/* 支付Data */
export interface PayDataI {
  type: PayTypeE; // 支付入口类型
  order_number: string; // 订单号
}

/* 支付返回结构 */
export interface PayResI {
  type: PayTypeE;
}
