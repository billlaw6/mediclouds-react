import { publicAPi } from "_axios";
import { OrderI, CreateOrderDataI } from "_types/order";

/* 获取订单列表 */
export const getOrderList = async (id: string): Promise<OrderI[]> =>
  await publicAPi.get(`/order/list`);
// await publicAPi.get(`/order/list/${id}`);

/* 创建订单 */
export const createOrder = async (data: CreateOrderDataI): Promise<OrderI> =>
  await publicAPi.post("/order/create", data);
