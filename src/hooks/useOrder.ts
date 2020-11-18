import { createOrder } from "_api/order";
import { OrderI } from "_types/order";
import useAccount from "./useAccount";

export default () => {
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

  return {
    generateLungNoduleFullReportOrder,
    generateScoreOrder,
  };
};
