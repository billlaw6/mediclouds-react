/* eslint-disable react/display-name */
import React, {
  FunctionComponent,
  useState,
  ReactNode,
  useEffect,
  Key,
  useCallback,
  useRef,
} from "react";
import { OrderI } from "_types/order";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { getOrderList } from "_api/order";
import Modal from "antd/lib/modal/Modal";
import OrderInfo from "_components/OrderInfo";

import OrderStatus from "_components/OrderStatus";
import ListControlBar from "_components/ListControlBar";

import "./style.less";
import useAccount from "_hooks/useAccount";
import moment from "antd/node_modules/moment";

const OrderList: FunctionComponent = () => {
  const { account } = useAccount();
  const id = useRef<string>(account.id);

  const [orderList, setOrderList] = useState<OrderI[]>();
  const [currentOrder, setCurrentOrder] = useState<OrderI>();
  const [selected, setSelected] = useState<string[]>();
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 }); // 选择的页码
  const [searchVal, setSearchVal] = useState(""); // 搜索的内容
  const [dateRange, setDateRange] = useState<string[]>(); // 日期范围
  const [filters, setFilters] = useState<any>(); // 过滤

  const columns: ColumnsType<OrderI> = [
    {
      title: "订单号",
      key: "order_number",
      dataIndex: "order_number",
      sorter: (a, b): number => parseInt(a.order_number, 10) - parseInt(b.order_number, 10),
    },
    {
      title: "创建者",
      key: "creator_username",
      dataIndex: "creator_username",
      sorter: (a, b): number => a.owner_id.localeCompare(b.owner_id),
    },
    {
      title: "用户名",
      key: "owner_username",
      dataIndex: "owner_username",
      render: (_val, recode): ReactNode => <span>{recode.owner_username}</span>,
      sorter: (a, b): number => `${a.owner_username}`.localeCompare(`${b.owner_username}`),
    },
    {
      title: "创建时间",
      key: "created_at",
      dataIndex: "created_at",
      render: (val) => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>,
      sorter: (a, b): number => Date.parse(a.created_at) - Date.parse(b.created_at),
    },
    // {
    //   title: "修改时间",
    //   key: "updated_at",
    //   dataIndex: "updated_at",
    //   render: (val) => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>,
    //   sorter: (a, b): number => Date.parse(a.updated_at) - Date.parse(b.updated_at),
    // },
    {
      title: "过期时间",
      key: "expire_date",
      dataIndex: "expire_date",
      sorter: (a, b): number => Date.parse(a.expire_date) - Date.parse(b.expire_date),
      render: (val) => <span>{moment(val).format("YYYY-MM-DD HH:mm:ss")}</span>,
    },
    {
      title: "资源数量",
      key: "uploaded_resources",
      dataIndex: "uploaded_resources",
      sorter: (a, b): number => a.uploaded_resources - b.uploaded_resources,
    },
    {
      title: "备注",
      key: "comment",
      dataIndex: "comment",
    },
    {
      title: "订单状态",
      key: "flag",
      dataIndex: "flag",
      render: (val): ReactNode => {
        return <OrderStatus status={val}></OrderStatus>;
      },
      filters: [
        { text: "未缴费", value: 0 },
        { text: "已缴费", value: 1 },
        { text: "已消费", value: 2 },
        { text: "已作废", value: 3 },
        { text: "已退款", value: 4 },
      ],
      onFilter: (val, account): boolean => account.flag === val,
    },
  ];

  const fetchData = useCallback((): void => {
    if (!id.current) return;

    const { current, pageSize } = pagination;
    let searchQuery = { keyword: searchVal, current, size: pageSize, filters };
    if (dateRange)
      searchQuery = Object.assign({}, searchQuery, {
        start: dateRange[0],
        end: dateRange[1],
      });

    getOrderList(id.current, searchQuery)
      .then((res) => setOrderList(res.results))
      .catch((err) => console.error(err));
  }, [dateRange, pagination, searchVal, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination, searchVal, filters]);

  /**
   * 批量选择
   *
   * @param {*} props
   * @returns
   */
  const onSelectChange = (selectedRowKeys: Key[]): void => setSelected(selectedRowKeys as string[]);

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
  };

  const onDateChange = (dateStrings: string[]): void => setDateRange(dateStrings);

  return (
    <>
      <ListControlBar
        selectedList={selected}
        searchPlaceholder="搜索订单号、用户名"
        customerBtns={null}
        showDatePicker
        onSearch={onSearch}
        onDateChage={onDateChange}
      ></ListControlBar>
      <Table
        loading={!orderList}
        dataSource={orderList}
        columns={columns}
        rowKey="id"
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
        rowClassName="order-list-row"
        onRow={(record) => ({
          onClick(): void {
            setCurrentOrder(record);
          },
        })}
        pagination={{
          defaultPageSize: 10,
          defaultCurrent: 1,
          ...pagination,
          onChange: onChangePagination,
          onShowSizeChange: onChangePagination,
        }}
        onChange={(pagination, filters): void => {
          const _filters: any = {};

          for (const key in filters) {
            const val = filters[key];
            if (val) _filters[key] = val;

            setFilters(_filters);
          }
        }}
      ></Table>
      <Modal
        width={1000}
        visible={!!currentOrder}
        onCancel={(): void => setCurrentOrder(undefined)}
        footer={null}
        // closeIcon={<CloseCircleOutlined />}
        maskClosable={false}
        keyboard={false}
      >
        <OrderInfo
          info={currentOrder}
          onChange={(): void => {
            fetchData();
          }}
        ></OrderInfo>
      </Modal>
    </>
  );
};

export default OrderList;
