/* eslint-disable react/display-name */
import React, { FunctionComponent, Key, ReactNode, useEffect, useState } from "react";
import { Modal, Table } from "antd";

import { delUsers, disableUsers, enableUsers, getAllUsers, RoleE, UserI } from "mc-api";
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

  const fetchList = (): void => {
    const { pageSize, current } = pagination;

    getAllUsers({
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
      render: (val): string => formatDate(val, true),
    },
    {
      title: "最后登录日期",
      key: "last_login",
      dataIndex: "last_login",
      render: (val): string => (val ? formatDate(val, true) : "NULL"),
    },
    {
      title: "DICOM数量",
      key: "my_dicom_files",
      dataIndex: "my_dicom_files",
    },
    {
      title: "病例数量",
      key: "my_case_files",
      dataIndex: "my_case_files",
    },
    {
      title: "AI报告数量",
      key: "my_ai_reports",
      dataIndex: "my_ai_reports",
    },
    {
      title: "状态",
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        { text: "已启用", value: "1" },
        { text: "已禁用", value: "0" },
      ],
      render: (val): ReactNode => {
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
        searchPlaceholder="搜索用户名或手机号"
        selectedList={selected}
        onSearch={(val): void => {
          setPagination(Object.assign({}, pagination, { current: 1 }));
          setSearchVal(val);
        }}
        onDel={(ids): void => {
          delUsers(ids)
            .then(() => {
              fetchList();
            })
            .catch((err) => console.error(err));
        }}
        onDisable={(ids): void => {
          disableUsers(ids)
            .then(() => fetchList())
            .catch((err) => console.error(err));
        }}
        onEnable={(ids): void => {
          enableUsers(ids)
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
        onChange={(pagination, filters): void => {
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
