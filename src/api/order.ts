import { publicReq } from "_axios";
import { OrderI, CreateOrderDataI, OrderTypesE, UpdateOrderDataI } from "_types/order";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";

/* 获取订单类型 */
export const getOrderTypes = async (): Promise<OrderTypesE[]> =>
  await publicReq({
    method: "GET",
    url: "/order/types/",
  });

/* 获取订单列表 */
export const getOrderList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<OrderI>> =>
  await publicReq({
    method: "POST",
    url: `/order/list/${id}/`,
    data: searchQuery,
  });

/* 创建订单 */
export const createOrder = async (data: CreateOrderDataI): Promise<OrderI> =>
  await publicReq({
    method: "POST",
    url: "/order/create/",
    data,
  });

/* 更新订单 */
export const updateOrder = async (id: string, data: UpdateOrderDataI): Promise<OrderI> =>
  await publicReq({
    method: "POST",
    url: `/order/update/${id}/`,
    data,
  });

/* 获取订单状态 */
export const getOrderStatus = async (orderNum: string): Promise<0 | 1 | 2 | 3 | 4> =>
  await publicReq({
    method: "GET",
    url: `/order/status/${orderNum}/`,
  });
