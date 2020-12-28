import { ProdI, RoleE } from "mc-api";

/* 订单结构 */
export interface OrderI {
  id: string; // 订单id
  order_number: string; // 订单号
  products: OrderProdI[]; // 此订单的商品信息列表
  owner_id: string; // 订单拥有者id
  order_price: number; // 订单金额 单位：分
  owner_username: string; // 订单拥有者用户名
  owner_role: RoleE; // 订单拥有者role类型
  first_name: string; // 用户真实姓 first_name
  last_name: string; // 用户真实名 last_name
  business_name: string; // 企业用户名
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
  owner_id: string; // 订单所有者id
  products: CreateOrderProdDataI[]; // 创建订单的商品列表
  comment?: string; // 备注
}

export interface CreateOrderProdDataI {
  id: number; // 商品ID
  amount: number; // 商品数量
}

export interface OrderProdI extends ProdI {
  amount: number; // 商品数量
  product_id: number; // 商品ID
}

/* 更新订单Data */
export interface UpdateOrderDataI {
  comment?: string;
  flag?: 0 | 1 | 2 | 3 | 4;
}

/* 订单类型 */
export enum OrderTypesE {
  DATA_STORAGE = "data_storage",
  EMR_COPY = "EMR_copy",
  CD_RECORD = "CD_record",
}
