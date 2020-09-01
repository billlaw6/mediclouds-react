/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect, ReactNode } from "react";
import { Table, Modal } from "antd";
import { AccountI, RoleE } from "_types/account";
import { getAffiliatedList } from "_api/user";
import { ColumnsType } from "antd/lib/table";

import "./style.less";
import Account from "_components/Account";

const colums: ColumnsType<AccountI> = [
  {
    title: "账户名",
    key: "username",
    dataIndex: "username",
    sorter: (a, b): number => a.username.localeCompare(b.username),
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
    sorter: (a, b): number =>
      `${a.first_name}${a.last_name}`.localeCompare(`${b.first_name}${b.last_name}`),
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
    title: "手机号",
    key: "cell_phone",
    dataIndex: "cell_phone",
  },
  {
    title: "账户类型",
    key: "role",
    dataIndex: "role",
    render: (val): ReactNode => {
      return <span>{val === RoleE.MANAGER ? "经理账户" : "员工账户"}</span>;
    },
    filters: [
      { text: "经理账户", value: RoleE.MANAGER },
      { text: "员工账户", value: RoleE.EMPLOYEE },
    ],
    onFilter: (val, account): boolean => account.role === (val as RoleE),
  },
];

const AccountList: FunctionComponent = (_props) => {
  const [accounts, setAccouts] = useState<AccountI[]>();
  const [currentAccount, setCurrentAccount] = useState<AccountI | null>(null);

  console.log("currentAccount", currentAccount);

  useEffect(() => {
    getAffiliatedList()
      .then((res) => setAccouts(res.filter((item) => item.role !== RoleE.BUSINESS)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="manager-account-list">
      <Table
        loading={!accounts}
        rowKey="id"
        rowClassName="manager-account-list-row"
        dataSource={accounts}
        columns={colums}
        onRow={(record) => ({
          onClick: (): void => setCurrentAccount(record),
        })}
      ></Table>
      {currentAccount ? (
        <Modal
          visible={!!currentAccount}
          onCancel={(): void => setCurrentAccount(null)}
          footer={null}
          width={1000}
        >
          <Account {...currentAccount}></Account>
        </Modal>
      ) : null}
    </div>
  );
};

export default AccountList;
