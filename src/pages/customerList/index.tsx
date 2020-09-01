/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect, ReactNode } from "react";
import { AccountI, RoleE } from "_types/account";
import { getCustomerList } from "_api/user";
import { Table, Button, Space, Result } from "antd";
import { ColumnsType } from "antd/lib/table";
import CreateOrder from "_components/CreateOrder";
import { ResultStatusType } from "antd/lib/result";

const CustomerList: FunctionComponent = (props) => {
  const [customerList, setCustomerList] = useState<AccountI[]>();
  const [createOrderId, setCreateOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<null | {
    status: ResultStatusType;
    text: string;
  }>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    getCustomerList()
      .then((res) => setCustomerList(res))
      .catch((err) => console.error(err));
  }, []);

  console.log("customer List", customerList);

  const colums: ColumnsType<AccountI> = [
    {
      title: "账户名",
      key: "username",
      dataIndex: "username",
      sorter: (a, b): number => a.username.localeCompare(b.username),
    },
    {
      title: "昵称",
      key: "nickname",
      dataIndex: "nickname",
      sorter: (a, b): number => a.username.localeCompare(b.username),
    },
    {
      title: "性别",
      key: "sex",
      dataIndex: "sex",
      render: (val): ReactNode => {
        return <span>{val === 0 ? "保密" : val === 1 ? "男" : "女"}</span>;
      },
      filters: [
        { text: "男", value: 1 },
        { text: "女", value: 2 },
        { text: "保密", value: 0 },
      ],
      onFilter: (val, account): boolean => account.sex === (val as number),
    },
    {
      title: "用户类型",
      key: "role",
      dataIndex: "role",
      render: (val): ReactNode => {
        return <span>{val === RoleE.DOCTOR ? "医生" : "患者"}</span>;
      },
      filters: [
        { text: "医生", value: RoleE.DOCTOR },
        { text: "患者", value: RoleE.PATIENT },
      ],
      onFilter: (val, account): boolean => account.role === (val as RoleE),
    },
    {
      title: "订单",
      key: "id",
      dataIndex: "id",
      render: (val, record) => {
        return (
          <>
            <Space>
              <Button type="primary" onClick={(): void => setCreateOrderId(val)}>
                添加订单
              </Button>
              {/* <Button type="ghost" onClick={(): void => setSelectedOrder(null)}>
                查看订单
              </Button> */}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div className="manager-customer-list">
      <CreateOrder
        customerId={createOrderId || ""}
        visible={!!createOrderId}
        onCancel={(): void => setCreateOrderId(null)}
        onSuccessed={(): void => {
          setCreateOrderId(null);
          setOrderStatus({ status: "success", text: "创建订单成功！" });
        }}
        onFailed={(): void => {
          setCreateOrderId(null);
          setOrderStatus({ status: "error", text: "创建订单失败！" });
        }}
      ></CreateOrder>
      {orderStatus ? (
        <Result
          status={orderStatus.status}
          title={orderStatus.text}
          extra={
            <Button type="primary" onClick={(): void => setOrderStatus(null)}>
              返回
            </Button>
          }
        ></Result>
      ) : (
        <Table
          rowKey="id"
          loading={!customerList}
          dataSource={customerList}
          columns={colums}
        ></Table>
      )}
    </div>
  );
};

export default CustomerList;
