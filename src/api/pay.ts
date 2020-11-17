import { publicReq } from "_axios";
import { PayDataI } from "_types/pay";

// /* 发起支付 */
// export const pay = async (data: PayDataI): Promise<string> =>
//   await publicReq({
//     method: "POST",
//     url: `/pay/`,
//     data,
//   });

/* 获取订单微信native二维码 */
export const getOrderWechatPayQrcode = async (order_number: string): Promise<string> =>
  await publicReq({
    method: "GET",
    url: "/pay/get-wechat-qrcode/",
    params: {
      order_number,
    },
  });
