import { publicAPi } from "_axios";
import { OrderI, CreateOrderDataI } from "_types/order";
import { GetSearchQueryPropsI } from "_types/api";

/* 获取订单列表 */
export const getOrderList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<OrderI[]> =>
  await publicAPi.get(`/order/list/${id}`, {
    params: searchQuery,
  });

/* 创建订单 */
export const createOrder = async (data: CreateOrderDataI): Promise<OrderI> =>
  await publicAPi.post("/order/create", data);
