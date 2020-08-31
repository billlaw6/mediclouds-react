/* eslint-disable react/display-name */
import React, { FunctionComponent, ReactNode, useState, useEffect, Key } from "react";
import { Table, Button, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { AccountI, RoleE } from "_types/account";
import { getAffiliatedList } from "_api/user";

import "./style.less";
import Account from "_components/Account";

const columns: ColumnsType<AccountI> = [
  {
    title: "账户名",
    key: "username",
    dataIndex: "username",
    sorter: (a, b): number => a.username.localeCompare(b.username),
  },
  {
    title: "企业名称",
    key: "business_name",
    dataIndex: "business_name",
    sorter: (a, b): number => `${a.business_name}`.localeCompare(`${b.business_name}`),
  },
];

const BusinessAccountList: FunctionComponent = () => {
  const [accounts, setAccouts] = useState<AccountI[]>();
  const [selected, setSelected] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<AccountI | null>(null);

  console.log("currentAccount", currentAccount);

  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

  useEffect(() => {
    getAffiliatedList()
      .then((res) => setAccouts(res.filter((item) => item.role === RoleE.BUSINESS)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="manager-business-account-list">
      <Table
        loading={!accounts}
        rowKey="id"
        rowClassName="manager-business-account-list-row"
        dataSource={accounts}
        columns={columns}
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
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

export default BusinessAccountList;
