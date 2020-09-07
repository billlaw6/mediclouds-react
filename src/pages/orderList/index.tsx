/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, ReactNode, useEffect } from "react";
import { OrderI } from "_types/order";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getOrderList } from "_api/order";
import Modal from "antd/lib/modal/Modal";
import OrderInfo from "_components/OrderInfo";
// import OrderStatus from "_components/OrderStatus";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import "./style.less";
import Nail from "_components/Nail";
import OrderStatus from "_components/OrderStatus";

const columns: ColumnsType<OrderI> = [
  {
    title: "订单号",
    key: "order_number",
    dataIndex: "order_number",
    sorter: (a, b): number => parseInt(a.order_number, 10) - parseInt(b.order_number, 10),
  },
  {
    title: "用户id",
    key: "customer_id",
    dataIndex: "customer_id",
    sorter: (a, b): number => a.customer_id.localeCompare(b.customer_id),
  },
  {
    title: "创建时间",
    key: "created_at",
    dataIndex: "created_at",
    sorter: (a, b): number => Date.parse(a.created_at) - Date.parse(b.created_at),
  },
  {
    title: "修改时间",
    key: "updated_at",
    dataIndex: "updated_at",
    sorter: (a, b): number => Date.parse(a.updated_at) - Date.parse(b.updated_at),
  },
  {
    title: "订单状态",
    key: "flag",
    dataIndex: "flag",
    render: (val): ReactNode => {
      return <OrderStatus status={val}></OrderStatus>;
    },
    filters: [
      { text: "未缴费", value: 0 },
      { text: "已缴费", value: 1 },
      { text: "已消费", value: 2 },
      { text: "已作废", value: 3 },
      { text: "已退款", value: 4 },
    ],
    onFilter: (val, account): boolean => account.flag === val,
  },
];

const OrderList: FunctionComponent = () => {
  const [orderList, setOrderList] = useState<OrderI[]>();
  const [currentOrder, setCurrentOrder] = useState<OrderI>();

  useEffect(() => {
    getOrderList("")
      .then((res) => setOrderList(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Table
        loading={!orderList}
        dataSource={orderList}
        columns={columns}
        rowKey="id"
        rowClassName="order-list-row"
        onRow={(record) => ({
          onClick(): void {
            setCurrentOrder(record);
          },
        })}
      ></Table>
      <Modal
        width={1000}
        visible={!!currentOrder}
        onCancel={(): void => setCurrentOrder(undefined)}
        footer={null}
        // closeIcon={<CloseCircleOutlined />}
        maskClosable={false}
        keyboard={false}
      >
        <OrderInfo info={currentOrder}></OrderInfo>
      </Modal>
    </>
  );
};

export default OrderList;
