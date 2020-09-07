/* eslint-disable react/display-name */
import React, { FunctionComponent, ReactNode, useRef, useEffect, useState, Key } from "react";
import Table, { ColumnsType } from "antd/lib/table";
import { AccountI, RoleE } from "_types/account";
import { Space, Button, Result } from "antd";
import useAccount from "_hooks/useAccount";
import { getCustomerList } from "_api/user";
import CreateOrder from "_components/CreateOrder";
import { ResultStatusType } from "antd/lib/result";
import ListControlBar from "_components/ListControlBar";

interface CustomerListPropsI {
  id?: string;
}

const CustomerList: FunctionComponent<CustomerListPropsI> = (props) => {
  const { account } = useAccount();
  const id = useRef<string>(props.id || account.id);
  const [list, setList] = useState<AccountI[]>();
  const [createOrderId, setCreateOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<null | {
    status: ResultStatusType;
    text: string;
  }>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

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
      title: "注册日期",
      key: "date_joined",
      dataIndex: "date_joined",
      sorter: (a, b): number => Date.parse(a.date_joined) - Date.parse(b.date_joined),
    },
    {
      title: "最后登录",
      key: "last_login",
      dataIndex: "last_login",
      sorter: (a, b): number => Date.parse(a.last_login) - Date.parse(b.last_login),
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

  const init = async (): Promise<void> => {
    if (!id.current) return;

    getCustomerList(id.current)
      .then((res) => setList(res))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    init()
      .then((): void => console.log("get current list successed!"))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="customer-list">
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
        <>
          <ListControlBar
            searchPlaceholder="搜索昵称、手机号"
            selectedList={selected}
            showDatePicker
          ></ListControlBar>
          <Table
            rowKey="id"
            loading={!list}
            dataSource={list}
            columns={colums}
            rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
          ></Table>
        </>
      )}
    </div>
  );
};

export default CustomerList;
