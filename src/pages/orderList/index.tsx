/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, ReactNode, useEffect } from "react";
import { OrderI } from "_types/order";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getOrderList } from "_api/order";

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
      let text = "";

      switch (val) {
        case 0:
          text = "未缴费";
          break;
        case 1:
          text = "已缴费";
          break;
        case 2:
          text = "已消费";
          break;
        case 3:
          text = "已作废";
          break;
        case 4:
          text = "已退款";
          break;
      }

      return <span>{text}</span>;
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

  useEffect(() => {
    getOrderList("")
      .then((res) => setOrderList(res))
      .catch((err) => console.error(err));
  }, []);

  return <Table loading={!orderList} dataSource={orderList} columns={columns}></Table>;
};

export default OrderList;
