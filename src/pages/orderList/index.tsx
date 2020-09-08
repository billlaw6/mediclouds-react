/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, ReactNode, useEffect, Key } from "react";
import { OrderI } from "_types/order";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getOrderList } from "_api/order";
import Modal from "antd/lib/modal/Modal";
import OrderInfo from "_components/OrderInfo";

import OrderStatus from "_components/OrderStatus";
import ListControlBar from "_components/ListControlBar";

import "./style.less";

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
    title: "用户名",
    key: "customer_first_name",
    dataIndex: "customer_first_name",
    render: (_val, recode): ReactNode => (
      <span>{`${recode.customer_first_name}${recode.customer_last_name}`}</span>
    ),
    sorter: (a, b): number =>
      `${a.customer_first_name}${a.customer_last_name}`.localeCompare(
        `${b.customer_first_name}${b.customer_last_name}`,
      ),
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
    title: "过期时间",
    key: "expire_date",
    dataIndex: "expire_date",
    sorter: (a, b): number => Date.parse(a.expire_date) - Date.parse(b.expire_date),
    render: (val): ReactNode => {
      return val;
      // return <span>{Date.now() - Date.parse(val) >= 0 ? "已过期" : val}</span>;
    },
  },
  {
    title: "资源数量",
    key: "uploaded_resources",
    dataIndex: "uploaded_resources",
    sorter: (a, b): number => a.uploaded_resources - b.uploaded_resources,
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
  const [selected, setSelected] = useState<string[]>();

  useEffect(() => {
    getOrderList("")
      .then((res) => setOrderList(res))
      .catch((err) => console.error(err));
  }, []);

  /**
   * 批量选择
   *
   * @param {*} props
   * @returns
   */
  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

  return (
    <>
      <ListControlBar
        selectedList={selected}
        searchPlaceholder="搜索订单号、用户名"
        customerBtns={null}
      ></ListControlBar>
      <Table
        loading={!orderList}
        dataSource={orderList}
        columns={columns}
        rowKey="id"
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
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
