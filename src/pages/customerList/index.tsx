/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect, ReactNode } from "react";
import { AccountI, RoleE } from "_types/account";
import { getCustomerList } from "_api/user";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";

const CustomerList: FunctionComponent = (props) => {
  const [customerList, setCustomerList] = useState<AccountI[]>();

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
    },
    {
      title: "昵称",
      key: "nickname",
      dataIndex: "nickname",
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
  ];

  return (
    <div className="manager-customer-list">
      <Table rowKey="id" loading={!customerList} dataSource={customerList} columns={colums}></Table>
    </div>
  );
};

export default CustomerList;
