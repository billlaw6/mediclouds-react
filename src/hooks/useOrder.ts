import { createOrder, getOrderStatus, getOrderWechatPayQrcode, OrderI } from "mc-api";
import { getTrulyPrice } from "_helper";
import useAccount from "./useAccount";
import useProd from "./useProd";

export default () => {
  const { getProdList } = useProd();
  const { account } = useAccount();

  /** 生成完整版报告的订单 */
  const generateLungNoduleFullReportOrder = async (prodId: number): Promise<OrderI> => {
    try {
      return await createOrder({
        owner_id: account.id,
        products: [
          {
            id: prodId,
            amount: 1,
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /** 购买积分的订单 */
  const generateScoreOrder = async (prodId: number, amount: number): Promise<OrderI> => {
    try {
      return await createOrder({
        owner_id: account.id,
        products: [
          {
            id: prodId,
            amount,
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * 购买商品
   *
   * @param {string} prodCode 商品Code
   * @param {number} [amount=1] 数量 默认1
   * @returns {Promise<{ order: OrderI; qrcode?: string }>} 返回支付二维码和此订单信息
   */
  const buyProd = async (
    prodCode: string,
    amount = 1,
  ): Promise<{ order: OrderI; qrcode?: string }> => {
    try {
      const prodListRes = await getProdList();
      const scoreProd = prodListRes.find((item) => item.code === prodCode);
      if (!scoreProd) throw new Error("没有此商品");

      const scoreOrderRes = await generateScoreOrder(scoreProd.id, amount);
      const { order_number } = scoreOrderRes;
      const price = getTrulyPrice(scoreProd);

      if (price > 0) {
        const qrcodeRes = await getOrderWechatPayQrcode(order_number);
        return {
          qrcode: qrcodeRes,
          order: scoreOrderRes,
        };
      }
      return { order: scoreOrderRes };
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * 购买积分
   *
   * @param {number} amount 积分数量
   * @returns {Promise<{ order: OrderI; qrcode?: string }>}
   */
  const buyScore = async (amount: number): Promise<{ order: OrderI; qrcode?: string }> => {
    try {
      return await buyProd("SCORE", amount);
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * 购买完整版肺结节AI筛查报告
   *
   * @returns {Promise<{ order: OrderI; qrcode?: string }>}
   */
  const buyLungNodulesFullReport = async (): Promise<{ order: OrderI; qrcode?: string }> => {
    try {
      return await buyProd("AI_LUNG_02");
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   * 购买简版肺结节AI筛查报告
   *
   * @returns {Promise<{ order: OrderI; qrcode?: string }>}
   */
  const buyLungNodulesReport = async (): Promise<{ order: OrderI; qrcode?: string }> => {
    try {
      return await buyProd("AI_LUNG_01");
    } catch (error) {
      throw new Error(error);
    }
  };

  /** 获取订单状态 */
  const _getOrderStatus = async (orderNum: string): Promise<0 | 1 | 2 | 3 | 4> => {
    try {
      return await getOrderStatus(orderNum);
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    generateLungNoduleFullReportOrder,
    generateScoreOrder,
    getOrderStatus: _getOrderStatus,
    buyScore,
    buyLungNodulesReport,
    buyLungNodulesFullReport,
  };
};
