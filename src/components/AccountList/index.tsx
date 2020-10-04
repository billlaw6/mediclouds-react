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

import React, {
  FunctionComponent,
  useRef,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Table, Modal } from "antd";
import useAccount from "_hooks/useAccount";
import { UserI, RoleE } from "_types/account";
import { delAccount, disableUser, enableUser, getAffiliatedList } from "_api/user";
import { ColumnsType } from "antd/es/table";
import { Key } from "antd/es/table/interface";
import Account from "_components/Account";
import AccountRole from "_components/AccountRole";
import ListControlBar from "_components/ListControlBar";
import { ColumnType } from "antd/lib/table";
import Nail from "_components/Nail";

import "./style.less";

interface AccountListPropsI {
  id?: string; // 指定账户的ID 数据源为此ID的下属账户 没有的话就是当前账户
  viewable?: boolean; // 是否能查看下属账户的详细信息（弹出Modal)
  filterRole?: RoleE[]; // 过滤显示的角色类型
  filterCol?: string[]; // 过滤显示的列 填入列id 填入的被过滤
  searchPlaceholder?: string; // 搜索框的placeholder
}

const AccountList: FunctionComponent<AccountListPropsI> = (props) => {
  const { viewable = true, filterRole, filterCol, searchPlaceholder } = props;
  const { account } = useAccount();
  const [list, setList] = useState<{ total: number; arr: UserI[] }>(); // 用户列表
  const [currentAccount, setCurrentAccount] = useState<UserI>(); // 当前选择的账户
  const [selected, setSelected] = useState<string[]>(); // 批量选择的账户id
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1 }); // 选择的页码
  const [searchVal, setSearchVal] = useState(""); // 搜索的内容
  const [filters, setFilters] = useState<any>(filterRole ? { role: filterRole } : undefined); // 过滤内容
  const [activeSelectSuperior, setActiveSelectSuperior] = useState(false);

  const id = useRef<string>(props.id || account.id);

  /**
   * 拉取数据
   *
   * @returns {Promise<void>}
   */
  const fetchData = useCallback((): void => {
    if (!id.current) return;

    const { current, pageSize } = pagination;

    getAffiliatedList(id.current, { keyword: searchVal, current, size: pageSize, filters })
      .then((res) => {
        const { results: list } = res;
        setList({ total: res.count, arr: list });
      })
      .catch((err) => console.error(err));
  }, [filterRole, pagination.pageSize, pagination.current, searchVal, filters]);

  /**
   * 批量选择
   *
   * @param {*} props
   * @returns
   */
  const onSelectChange = (selectedRowKeys: Key[], row: UserI[]): void => {
    const _role = row[0].role;
    if (row.some((item) => item.role === _role)) setActiveSelectSuperior(true);
    else setActiveSelectSuperior(false);

    setSelected(selectedRowKeys as string[]);
  };

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

  useEffect(() => {
    if (list) setList(undefined);

    fetchData();
  }, [fetchData, pagination.pageSize, pagination.current, searchVal, filters]);

  let columns: ColumnsType<UserI> = [
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
    {
      title: "激活状态",
      key: "is_active",
      dataIndex: "is_active",
      filters: [
        { text: "已启用", value: 1 },
        { text: "已停用", value: 0 },
      ],
      render: (val) => (
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
      ),
    },
  ];

  if (filterCol)
    columns = columns.filter((item) => {
      const { dataIndex } = item as ColumnType<UserI>;
      return filterCol.indexOf(dataIndex as string) < 0;
    });

  return (
    <div className="account-list">
      <ListControlBar
        selectedList={selected}
        searchPlaceholder={searchPlaceholder || "搜索账户名、手机号"}
        onSearch={onSearch}
        onDel={(ids): void => {
          delAccount(ids)
            .then((res) => {
              fetchData();
            })
            .catch((err) => console.error(err));
        }}
        onDisable={(ids): void => {
          disableUser(ids)
            .then(() => fetchData())
            .catch((err) => console.error(err));
        }}
        onEnable={(ids): void => {
          enableUser(ids)
            .then(() => fetchData())
            .catch((err) => console.error(err));
        }}
      ></ListControlBar>
      <Table
        loading={!list}
        rowKey="id"
        rowClassName={viewable ? "account-list-row" : ""}
        dataSource={list ? list.arr : []}
        columns={columns}
        rowSelection={{ selectedRowKeys: selected, onChange: onSelectChange }}
        onRow={(record) => ({
          onClick: (): void => {
            viewable && setCurrentAccount(record);
          },
        })}
        onChange={(pagination, onChangeFilters) => {
          const _filters: any = {};

          for (const key in onChangeFilters) {
            const val = onChangeFilters[key];

            if (val) _filters[key] = val;
          }
          setFilters(Object.assign({}, filters, _filters));
        }}
        pagination={{
          defaultPageSize: 10,
          defaultCurrent: 1,
          ...pagination,
          total: list ? list.total : 0,
          onChange: onChangePagination,
          onShowSizeChange: onChangePagination,
        }}
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
