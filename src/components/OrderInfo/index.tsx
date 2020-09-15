import React, { FunctionComponent, useState } from "react";
import { useHistory } from "react-router";
import { OrderI, UpdateOrderDataI } from "_types/order";
import { Descriptions, Input, Form, Button, Space, Tabs, Popconfirm, Menu, Select } from "antd";
import { Store } from "antd/lib/form/interface";

import OrderStatus from "_components/OrderStatus";
import { WarningOutlined } from "@ant-design/icons";

import "./style.less";
import Uploader from "_components/Uploader";
import { RoleE } from "_types/account";
import { updateOrder } from "_api/order";
import UserStats from "_pages/dashboard/components/UserStats";
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
  const [preData, setPreData] = useState<{ flag: 0 | 1 | 2 | 3 | 4; comment: string }>();

  if (!info) return null;

  const {
    id,
    flag,
    order_number,
    creator_id,
    owner_id,
    created_at,
    charged_at,
    updated_at,
    first_name,
    last_name,
    owner_role,
    business_name,
    creator_username,
    comment,
  } = info;

  const onFinish = (vals: Store): void => {
    console.log("vals", vals);
    updateOrder(order_number, vals).then(
      (res) => console.log("update order", res),
      (err) => console.error(err),
    );
  };

  console.log("flag", flag);

  return (
    <div className="order-info">
      <Tabs>
        <TabPane key="info" tab="订单信息">
          <Form
            initialValues={{ comment, flag }}
            onValuesChange={(val): void => setPreData(Object.assign({}, preData, val))}
          >
            <Descriptions className="order-info-content" bordered={true}>
              <DescItem label="订单号">{order_number}</DescItem>
              <DescItem label="创建时间">{created_at}</DescItem>
              <DescItem label="创建者">{creator_username}</DescItem>
              <DescItem label="订单状态">
                <FormItem name="flag">
                  {flag > 2 ? (
                    <OrderStatus status={flag}></OrderStatus>
                  ) : (
                    <Select>
                      <Select.Option value={0} disabled={flag > 0}>
                        <OrderStatus status={0}></OrderStatus>
                      </Select.Option>
                      <Select.Option value={1} disabled={flag > 1}>
                        <OrderStatus status={1}></OrderStatus>
                      </Select.Option>
                      <Select.Option value={2} disabled={flag > 2}>
                        <OrderStatus status={2}></OrderStatus>
                      </Select.Option>
                    </Select>
                  )}
                </FormItem>
              </DescItem>
              <DescItem label="关联id">{owner_id}</DescItem>
              {owner_role === RoleE.BUSINESS ? (
                <DescItem label="企业用户名">{business_name}</DescItem>
              ) : (
                <DescItem label="关联用户姓名">{`${first_name}${last_name}`}</DescItem>
              )}
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
                    onConfirm={(): void => {
                      updateOrder(order_number, { flag: 3 }).then(
                        (res) => console.log("update flag: ", res),
                        (err) => console.error(err),
                      );
                    }}
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
                  <Popconfirm
                    title="确认更新订单吗？此操作不可逆"
                    disabled={!preData}
                    onConfirm={(): void => {
                      if (!preData) return;

                      updateOrder(order_number, preData)
                        .then(() => console.log("successed"))
                        .catch((err) => console.error(err));
                    }}
                    okText="更新"
                    cancelText="取消"
                    okType="primary"
                    icon={<WarningOutlined />}
                  >
                    <Button type="primary" htmlType="submit">
                      更新订单信息
                    </Button>
                  </Popconfirm>
                </FormItem>
              </Space>
            </div>
          </Form>
        </TabPane>
        <TabPane disabled={flag !== 1} key="uploader" tab="上传检查资料">
          {flag !== 1 ? null : <Uploader directory={true}></Uploader>}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default OrderInfo;
