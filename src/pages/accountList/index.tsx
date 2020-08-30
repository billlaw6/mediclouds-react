/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect, ReactNode } from "react";
import { Table } from "antd";
import { AccountI, AccountTypeE } from "_types/api";
import { getAffiliatedList } from "_api/user";
import { ColumnsType } from "antd/lib/table";

const AccountList: FunctionComponent = (_props) => {
  const [accounts, setAccouts] = useState<AccountI[]>();

  useEffect(() => {
    getAffiliatedList()
      .then((res) => setAccouts(res))
      .catch((err) => console.error(err));
  }, []);

  const colums: ColumnsType<AccountI> = [
    {
      title: "账户名",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "姓名",
      key: "first_name",
      dataIndex: "first_name",
      render: (_val, account): ReactNode => {
        return (
          <span>
            {account.first_name}
            {account.last_name}
          </span>
        );
      },
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
      title: "账户类型",
      key: "role",
      dataIndex: "role",
      render: (val): ReactNode => {
        return (
          <span>
            {val === AccountTypeE.BUSINESS
              ? "企业账户"
              : val === AccountTypeE.MANAGER
              ? "经理账户"
              : "员工账户"}
          </span>
        );
      },
      filters: [
        { text: "企业账户", value: AccountTypeE.BUSINESS },
        { text: "经理账户", value: AccountTypeE.MANAGER },
        { text: "员工账户", value: AccountTypeE.EMPLOYEE },
      ],
      onFilter: (val, account): boolean => account.role === (val as AccountTypeE),
    },
  ];

  return (
    <div className="manager-account-list">
      <Table loading={!accounts} rowKey="id" dataSource={accounts} columns={colums}></Table>
    </div>
  );
};

export default AccountList;
