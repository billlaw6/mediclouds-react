import React, { FunctionComponent } from "react";
import { Tag } from "antd";
import {
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

interface OrderStatusPropsI {
  status: 0 | 1 | 2 | 3 | 4;
}

const OrderStatus: FunctionComponent<OrderStatusPropsI> = (props) => {
  const { status } = props;
  switch (status) {
    case 0:
      return (
        <Tag color="warning" icon={<ExclamationCircleOutlined></ExclamationCircleOutlined>}>
          未缴费
        </Tag>
      );
    case 1:
      return (
        <Tag color="processing" icon={<IssuesCloseOutlined />}>
          已缴费
        </Tag>
      );
    case 2:
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          已消费
        </Tag>
      );
    case 3:
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          已作废
        </Tag>
      );
    case 4:
      return (
        <Tag color="magenta" icon={<MinusCircleOutlined />}>
          已退款
        </Tag>
      );
    default:
      return (
        <Tag color="warning" icon={<ExclamationCircleOutlined />}>
          未缴费
        </Tag>
      );
  }
};

export default OrderStatus;
