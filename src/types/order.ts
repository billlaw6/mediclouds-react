/* 订单结构 */
export interface OrderI {
  id: string; // 订单id
  order_number: string; // 订单号
  order_type: string; // 订单类型
  customer_id: string; // 用户ID
  customer_first_name: string; // 用户真实姓 first_name
  customer_last_name: string; // 用户真实名 last_name
  creator_id: string; // 创建者账户ID
  creator_username: string; // 创建者的账户名
  created_at: string; // 创建时间
  updated_at: string; // 更新时间
  charged_at: string; // 付费时间
  expire_date: string; // 过期时间
  uploaded_resources: number; // 此订单含有资源数量
  flag: 0 | 1 | 2 | 3 | 4; // 订单状态  0: 未缴费 1: 已缴费 2:已消费 3:已作废 4:已退款
  comment: string; // 订单备注
}

/* 创建订单Data */
export interface CreateOrderDataI {
  customer_id: string;
  order_type: string;
  comment?: string;
}
