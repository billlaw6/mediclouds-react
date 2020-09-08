/* eslint-disable react/display-name */
/* 
  对账户（不包含企业账户）的查看和管理
  
  - 查看基本信息
  - 查看账户统计
  - 查看下属用户
  - 批量删除、冻结、移动账户
  - 搜索和过滤
  - 排序

*/

import React, { FunctionComponent, useRef, useState, useEffect, ReactNode } from "react";
import { Table, Modal } from "antd";
import useAccount from "_hooks/useAccount";
import { AccountI, RoleE } from "_types/account";
import { getAffiliatedList } from "_api/user";
import { ColumnsType } from "antd/es/table";
import { Key } from "antd/es/table/interface";
import Account from "_components/Account";

import "./style.less";
import AccountRole from "_components/AccountRole";
import ListControlBar from "_components/ListControlBar";
import { ColumnType } from "antd/lib/table";

interface AccountListPropsI {
  id?: string; // 指定账户的ID 数据源为此ID的下属账户 没有的话就是当前账户
  viewable?: boolean; // 是否能查看下属账户的详细信息（弹出Modal)
  filterRole?: RoleE[]; // 过滤显示的角色类型 填入的被过滤
  filterCol?: string[]; // 过滤显示的列 填入列id 填入的被过滤
  searchPlaceholder?: string; // 搜索框的placeholder
}

const AccountList: FunctionComponent<AccountListPropsI> = (props) => {
  const { viewable = true, filterRole, filterCol, searchPlaceholder } = props;
  const { account } = useAccount();
  const [list, setList] = useState<AccountI[]>(); // 用户列表
  const [currentAccount, setCurrentAccount] = useState<AccountI>(); // 当前选择的账户
  const [selected, setSelected] = useState<string[]>(); // 批量选择的账户id
  // const [selectMode, setSelectMode] = useState(false); // 切换选择模式

  const id = useRef<string>(props.id || account.id);
  /**
   * 初始化
   *
   * @returns {Promise<void>}
   */
  const init = async (): Promise<void> => {
    if (!id.current) return;

    let listRes = await getAffiliatedList(id.current);
    if (filterRole)
      listRes = listRes.filter((item) => {
        const { role } = item;
        return filterRole.indexOf(role) < 0;
      });

    setList(listRes);
  };

  /**
   * 批量选择
   *
   * @param {*} props
   * @returns
   */
  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

  useEffect(() => {
    init()
      .then(() => console.log("get list successed"))
      .catch((err) => console.error(err));
  }, []);

  let columns: ColumnsType<AccountI> = [
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
      sorter: (a, b): number => parseInt(a.cell_phone, 10) - parseInt(b.cell_phone, 10),
    },
    {
      title: "账户类型",
      key: "role",
      dataIndex: "role",
      render: (val): ReactNode => {
        return <AccountRole role={val}></AccountRole>;
      },
      filters: [
        { text: "经理账户", value: RoleE.MANAGER },
        { text: "员工账户", value: RoleE.EMPLOYEE },
      ],
      onFilter: (val, account): boolean => account.role === (val as RoleE),
    },
  ];

  if (filterCol)
    columns = columns.filter((item) => {
      const { dataIndex } = item as ColumnType<AccountI>;
      return filterCol.indexOf(dataIndex as string) < 0;
    });

  return (
    <div className="account-list">
      <ListControlBar
        selectedList={selected}
        searchPlaceholder={searchPlaceholder || "搜索账户名、手机号"}
      ></ListControlBar>
      <Table
        loading={!list}
        rowKey="id"
        rowClassName={viewable ? "account-list-row" : ""}
        dataSource={list}
        columns={columns}
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
        onRow={(record) => ({
          onClick: (): void => {
            viewable && setCurrentAccount(record);
          },
        })}
      ></Table>
      {currentAccount ? (
        <Modal
          visible={!!currentAccount}
          onCancel={(): void => setCurrentAccount(undefined)}
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
