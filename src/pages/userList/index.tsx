/* eslint-disable react/display-name */
import React, { FunctionComponent, Key, ReactNode, useEffect, useState } from "react";
import { Modal, Table } from "antd";
import { RoleE, UserI } from "_types/account";

import { delAccount, disableUser, enableUser, getAllUser } from "_api/user";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import AccountRole from "_components/AccountRole";
import Nail from "_components/Nail";
import ListControlBar from "_components/ListControlBar";
import Account from "_components/Account";

import "./style.less";
import { formatDate } from "_helper";

const UserList: FunctionComponent = () => {
  const [list, setList] = useState<UserI[]>(); // 获取用户资源
  const [selected, setSelected] = useState<string[]>(); // 批量选择的账户id
  const [currentAccount, setCurrentAccount] = useState<UserI>(); // 当前选择的账户
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 10,
    current: 1,
    total: 0,
  }); // 选择的页码
  const [filters, setFilters] = useState<any>();
  const [searchVal, setSearchVal] = useState("");

  /**
   *  更新页码触发
   *
   * @param {number} current
   * @param {number} [pageSize=10]
   */
  const onChangePagination = (current: number, pageSize = 10): void => {
    setPagination({ current, pageSize });
  };

  /**
   * 批量选择
   *
   * @param {*} props
   * @returns
   */
  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

  const fetchList = () => {
    const { pageSize, current } = pagination;

    getAllUser({
      current,
      size: pageSize,
      keyword: searchVal,
      filters: filters,
      sort: "date_joined",
    })
      .then((res) => {
        setList(res.results);
        setPagination(Object.assign({}, pagination, { total: res.count }));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchList();
  }, [searchVal, pagination.current, filters]);

  const columns: ColumnsType<UserI> = [
    {
      title: "用户名",
      key: "username",
      dataIndex: "username",
      sorter: (a, b): number => a.username.localeCompare(b.username),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (val): ReactNode => <AccountRole role={val}></AccountRole>,
      filters: [
        { text: "超级管理员", value: RoleE.SUPER_ADMIN },
        { text: "企业账户", value: RoleE.BUSINESS },
        { text: "经理账户", value: RoleE.MANAGER },
        { text: "员工账户", value: RoleE.EMPLOYEE },
        { text: "患者", value: RoleE.PATIENT },
        { text: "医生", value: RoleE.DOCTOR },
      ],
      // onFilter: (val, account): boolean => account.role === (val as RoleE),
    },
    {
      title: "手机号",
      key: "cell_phone",
      dataIndex: "cell_phone",
    },
    {
      title: "创建日期",
      key: "date_joined",
      dataIndex: "date_joined",
      render: (val) => formatDate(val, true),
    },
    {
      title: "最后登录日期",
      key: "last_login",
      dataIndex: "last_login",
      render: (val) => (val ? formatDate(val, true) : "NULL"),
    },
    {
      title: "状态",
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        { text: "已启用", value: "1" },
        { text: "已禁用", value: "0" },
      ],
      render: (val) => {
        return (
          <Nail
            target={`${val}`}
            rules={[
              {
                key: "1",
                content: {
                  text: "激活",
                  color: "green",
                },
              },
              {
                key: "0",
                content: {
                  text: "禁用",
                  color: "red",
                },
              },
            ]}
          ></Nail>
        );
      },
    },
  ];

  return (
    <div className="manager-users">
      <ListControlBar
        selectedList={selected}
        onSearch={(val) => {
          setPagination(Object.assign({}, pagination, { current: 1 }));
          setSearchVal(val);
        }}
        onDel={(ids): void => {
          delAccount(ids)
            .then((res) => {
              fetchList();
            })
            .catch((err) => console.error(err));
        }}
        onDisable={(ids): void => {
          disableUser(ids)
            .then(() => fetchList())
            .catch((err) => console.error(err));
        }}
        onEnable={(ids): void => {
          enableUser(ids)
            .then(() => fetchList())
            .catch((err) => console.error(err));
        }}
      ></ListControlBar>
      <Table
        loading={!list}
        dataSource={list}
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
        rowKey="id"
        onRow={(record) => ({
          onClick: (): void => {
            setCurrentAccount(record);
          },
        })}
        onChange={(pagination, filters, sorter) => {
          const _filters: any = {};

          for (const key in filters) {
            const val = filters[key];

            if (val) _filters[key] = val;
          }
          setFilters(_filters);
        }}
        pagination={{
          ...pagination,
          onChange: onChangePagination,
          onShowSizeChange: onChangePagination,
        }}
        columns={columns}
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

export default UserList;
