/* eslint-disable react/display-name */
import React, {
  FunctionComponent,
  ReactNode,
  useRef,
  useEffect,
  useState,
  Key,
  useCallback,
} from "react";
import Table, { ColumnsType } from "antd/lib/table";
import { UserI, RoleE } from "_types/account";
import { Space, Button, Result } from "antd";
import useAccount from "_hooks/useAccount";
import { delAccount, getCustomerList } from "_api/user";
import CreateOrder from "_components/CreateOrder";
import { ResultStatusType } from "antd/lib/result";
import ListControlBar from "_components/ListControlBar";
import AccountStatus from "_components/AccountStatus";
import { formatDate } from "_helper";
import useProd from "_hooks/useProd";
import { SorterResult } from "antd/lib/table/interface";

interface CustomerListPropsI {
  id?: string;
}

const CustomerList: FunctionComponent<CustomerListPropsI> = (props) => {
  const { account } = useAccount();
  const { prods, getProdList } = useProd();

  const id = useRef<string>(props.id || account.id);
  const [list, setList] = useState<{ total: number; arr: UserI[] }>();
  const [createOrderId, setCreateOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<null | {
    status: ResultStatusType;
    text: string;
  }>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 }); // 选择的页码
  const [searchVal, setSearchVal] = useState(""); // 搜索的内容
  const [dateRange, setDateRange] = useState<string[]>();
  const [filters, setFilters] = useState<any>(); // 过滤条件
  const [sort, setSort] = useState<{ sort: string; ascend: 0 | 1 }>({ sort: "", ascend: 0 });

  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

  const colums: ColumnsType<UserI> = [
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
      // onFilter: (val, account): boolean => account.sex === (val as number),
    },
    {
      title: "手机号",
      key: "cell_phone",
      dataIndex: "cell_phone",
    },
    // {
    //   title: "顾客类型",
    //   key: "role",
    //   dataIndex: "role",
    //   render: (val): ReactNode => {
    //     return <span>{val === RoleE.DOCTOR ? "医生" : "患者"}</span>;
    //   },
    //   filters: [
    //     { text: "医生", value: RoleE.DOCTOR },
    //     { text: "患者", value: RoleE.PATIENT },
    //   ],
    //   // onFilter: (val, account): boolean => account.role === (val as RoleE),
    // },
    {
      title: "注册日期",
      key: "date_joined",
      dataIndex: "date_joined",
      render: (val) => <span>{formatDate(val, true)}</span>,
      // sorter: (a, b): number => Date.parse(a.date_joined) - Date.parse(b.date_joined),
      sorter: true,
    },
    {
      title: "最后登录",
      key: "last_login",
      dataIndex: "last_login",
      render: (val) => {
        if (!val) return null;
        return <span>{formatDate(val, true)}</span>;
      },
      sorter: (a, b): number => Date.parse(a.last_login) - Date.parse(b.last_login),
    },
    {
      title: "状态",
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        { text: "已启用", value: 1 },
        { text: "已禁用", value: 0 },
      ],
      render: (val) => <AccountStatus status={val}></AccountStatus>,
    },
    {
      title: "订单",
      key: "id",
      dataIndex: "id",
      render: (val, record) => {
        const { is_active } = record;

        return (
          <>
            <Space>
              <Button
                disabled={!is_active}
                type="primary"
                onClick={(): void => {
                  is_active && setCreateOrderId(val);
                }}
              >
                添加订单
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  const fetchList = useCallback((): void => {
    if (!id.current) return;

    const { current, pageSize } = pagination;
    let searchQuery = { keyword: searchVal, current, size: pageSize, filters, ...sort };
    if (dateRange)
      searchQuery = Object.assign({}, searchQuery, {
        start: dateRange[0],
        end: dateRange[1],
      });
    getCustomerList(id.current, searchQuery)
      .then((res) => setList({ total: res.count, arr: res.results }))
      .catch((err) => console.error(err));
    getProdList()
      .then((res) => {
        // console.log("prods", res);
      })
      .catch((err) => console.error(err));
  }, [dateRange, pagination.current, pagination.pageSize, searchVal, filters, sort]);

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
   * 搜索时触发
   *
   * @param {string} val
   */
  const onSearch = (val: string): void => {
    setSearchVal(val);
    setPagination(Object.assign({}, pagination, { current: 1 }));
  };

  const onDateChange = (dateStrings: string[]): void => setDateRange(dateStrings);

  useEffect(() => {
    if (list) setList(undefined);

    fetchList();
  }, [fetchList, pagination.current, pagination.pageSize, searchVal, filters]);

  return (
    <div className="customer-list">
      <CreateOrder
        ownerId={createOrderId || ""}
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
            onSearch={onSearch}
            onDateChage={onDateChange}
            onDel={(ids): void => {
              delAccount(ids)
                .then((res) => console.log("del customer success"))
                .catch((err) => console.error(err));
            }}
            customerBtns={null}
          ></ListControlBar>
          <Table
            rowKey="id"
            loading={!list}
            dataSource={list ? list.arr : []}
            columns={colums}
            rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
            pagination={{
              defaultPageSize: 10,
              defaultCurrent: 1,
              ...pagination,
              total: list ? list.total : 0,
              onChange: onChangePagination,
              onShowSizeChange: onChangePagination,
            }}
            onChange={(pagination, filters, sorter) => {
              const _filters: any = {};
              const { order, field = "" } = sorter as SorterResult<UserI>;

              for (const key in filters) {
                const val = filters[key];

                if (val) _filters[key] = val;
              }

              setFilters(_filters);

              setSort({ ascend: order ? (order === "ascend" ? 1 : 0) : 0, sort: field as string });
            }}
          ></Table>
        </>
      )}
    </div>
  );
};

export default CustomerList;
