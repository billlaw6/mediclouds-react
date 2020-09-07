import React, { FunctionComponent } from "react";
import {
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import Nail from "_components/Nail";

interface OrderStatusPropsI {
  status: 0 | 1 | 2 | 3 | 4;
}

const OrderStatus: FunctionComponent<OrderStatusPropsI> = (props) => {
  const { status } = props;

  return (
    <Nail
      rules={[
        {
          key: "0",
          content: { text: "未缴费", icon: <ExclamationCircleOutlined />, color: "warning" },
        },
        {
          key: "1",
          content: { text: "已缴费", icon: <IssuesCloseOutlined />, color: "processing" },
        },
        { key: "2", content: { text: "已消费", icon: <CheckCircleOutlined />, color: "success" } },
        { key: "3", content: { text: "已作废", icon: <CloseCircleOutlined />, color: "error" } },
        { key: "4", content: { text: "已退款", icon: <MinusCircleOutlined />, color: "magenta" } },
      ]}
      target={`${status}`}
    ></Nail>
  );
};

export default OrderStatus;
