import React, { FunctionComponent } from "react";
import { useHistory } from "react-router";
import { OrderI } from "_types/order";
import { Descriptions, Input, Form, Button, Space, Tabs, Popconfirm } from "antd";
import { Store } from "antd/lib/form/interface";

import OrderStatus from "_components/OrderStatus";
import { WarningOutlined } from "@ant-design/icons";

import "./style.less";
interface OrderInfoPropsI {
  info?: OrderI;
  onChange?: (status: number, info: OrderI) => void;
}

const { Item: DescItem } = Descriptions;
const { Item: FormItem } = Form;
const { TabPane } = Tabs;

const OrderInfo: FunctionComponent<OrderInfoPropsI> = (props) => {
  const history = useHistory();
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
      <Tabs>
        <TabPane key="info" tab="订单信息">
          <Form initialValues={{ comment }} onFinish={updateOrder}>
            <Descriptions className="order-info-content" bordered={true}>
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
                  <Popconfirm
                    title="确认作废订单吗？此操作不可逆"
                    onConfirm={() => console.log("destory order")}
                    okText="作废"
                    cancelText="取消"
                    okType="danger"
                    icon={<WarningOutlined />}
                  >
                    <Button disabled={flag === 3 || flag === 2} danger type="primary">
                      作废
                    </Button>
                  </Popconfirm>
                </FormItem>
                <FormItem className="order-info-form-item">
                  <Button type="primary" htmlType="submit">
                    更新订单信息
                  </Button>
                </FormItem>
              </Space>
            </div>
          </Form>
        </TabPane>
        <TabPane disabled={flag !== 1} key="uploader" tab="上传检查资料">
          {flag !== 1 ? null : <div>upload</div>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderInfo;
