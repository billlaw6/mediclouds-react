import React, { FunctionComponent } from "react";
import { OrderI } from "_types/order";
import { Descriptions, Input, Form, Button, Space } from "antd";
import { Store } from "antd/lib/form/interface";

import "./style.less";
import OrderStatus from "_components/OrderStatus";

interface OrderInfoPropsI {
  info?: OrderI;
  onChange?: (status: number, info: OrderI) => void;
}

const { Item: DescItem } = Descriptions;
const { Item: FormItem } = Form;

const OrderInfo: FunctionComponent<OrderInfoPropsI> = (props) => {
  const { info, onChange } = props;

  if (!info) return null;

  const {
    id,
    flag,
    order_number,
    creator_id,
    customer_id,
    created_at,
    charged_at,
    updated_at,
    customer_first_name,
    customer_last_name,
    creator_username,
    comment,
  } = info;

  const updateOrder = (vals: Store) => {
    console.log("vals", vals);
  };

  return (
    <div className="order-info">
      <Form initialValues={{ comment }} onFinish={updateOrder}>
        <Descriptions className="order-info-content" title="订单详情" bordered={true}>
          <DescItem label="订单号">{order_number}</DescItem>
          <DescItem label="创建时间">{created_at}</DescItem>
          <DescItem label="创建者">{creator_username}</DescItem>
          <DescItem label="订单状态">
            <OrderStatus status={flag}></OrderStatus>
          </DescItem>
          <DescItem label="关联用户id">{customer_id}</DescItem>
          <DescItem label="关联用户姓名">{`${customer_first_name}${customer_last_name}`}</DescItem>
          <DescItem label="备注">
            <FormItem className="order-info-form-item" name="comment">
              <Input.TextArea></Input.TextArea>
            </FormItem>
          </DescItem>
        </Descriptions>

        <div className="order-info-ctl">
          <Space>
            <FormItem className="order-info-form-item">
              <Button disabled={flag === 3 || flag === 2} danger type="primary">
                作废
              </Button>
            </FormItem>
            <FormItem className="order-info-form-item">
              <Button type="primary" htmlType="submit">
                更新订单信息
              </Button>
            </FormItem>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default OrderInfo;
