import React, { ReactElement } from "react";
import { Table, Button, Form, Input, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { GetSearchQueryPropsI, SearchQueryResI, UserI } from "_types/api";
import { getUserList, deactivateUsers, activateUsers, deleteUsers } from "_api/user";
import { UserManagePropsI, UserManageStateI } from "_pages/users/type";
import "./UserManage.less";
import { KeyOutlined } from "@ant-design/icons";

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class UserManage extends React.Component<UserManagePropsI, UserManageStateI> {
  constructor(props: UserManagePropsI) {
    super(props);
    this.state = {
      userList: [],
      searchResult: [],
      selectedRowKeys: [],
      userTotal: 0,
      searchQuery: { ascend: 1, sort: "date_joined" }, // sort key: nickname, cell_phone, is_active, date_joined
    };
  }

  fetchUserList = (searchQuery?: GetSearchQueryPropsI): void => {
    getUserList(searchQuery)
      .then((res: any) => {
        this.setState({ userList: res.results, searchResult: res.results, userTotal: res.count });
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  searchUser = (e: any): void => {
    const { userList } = this.state;
    const { value } = e.target;
    if (value) {
      const searchResult = userList.filter((item) => {
        // console.log(item.nickname.toLowerCase().indexOf(value.toLowerCase()));
        if (item.nickname && item.nickname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          return true;
        } else if (
          item.cell_phone &&
          `${item.cell_phone}`.toLowerCase().indexOf(value.toLowerCase()) >= 0
        ) {
          return true;
        } else {
          return false;
        }
      });
      this.setState({ searchResult: searchResult });
    } else {
      this.setState({ searchResult: userList });
    }
  };

  componentDidMount(): void {
    const { searchQuery } = this.state;

    this.fetchUserList(searchQuery);
  }

  // getTableRowKey = (record: UserI): string => {
  //     return record.id.toString();
  // }

  batchDeactivate = (): void => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      deactivateUsers(selectedRowKeys)
        .then((res: any) => {
          // console.log(res);
          this.fetchUserList(this.state.searchQuery);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  batchActivate = (): void => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      activateUsers(selectedRowKeys)
        .then((res: any) => {
          // console.log(res);
          this.fetchUserList(this.state.searchQuery);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  batchDelete = (): void => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length > 0) {
      deleteUsers(selectedRowKeys)
        .then((res: any) => {
          // console.log(res);
          this.fetchUserList(this.state.searchQuery);
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  render(): ReactElement {
    const { user } = this.props;
    const { selectedRowKeys, searchResult, userTotal } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys: any, selectedRows: UserI[]) => {
        // console.log(selectedRowKeys);
        this.setState({ selectedRowKeys });
      },
      getCheckboxProps: (record: UserI) => ({
        disabled: record.username === "test",
        name: record.nickname,
      }),
    };
    const columns: any = [
      {
        title: "昵称",
        dataIndex: "nickname",
        key: "nickname",
        sorter: (a: UserI, b: UserI) => {
          return a.nickname.localeCompare(b.nickname, "zh-CN");
        },
      },
      {
        title: "手机号",
        dataIndex: "cell_phone",
        key: "cell_phone",
        sorter: (a: UserI, b: UserI) => {
          return `${a.cell_phone}`.localeCompare(`${b.cell_phone}`, "zh-CN");
        },
      },
      {
        title: "状态",
        dataIndex: "is_active",
        key: "is_active",
        render: (text: any, record: UserI) => {
          const color = record.is_active ? "green" : "red";
          return record.is_active ? (
            <span style={{ color: color }}>在用</span>
          ) : (
            <span style={{ color: color }}>禁用</span>
          );
        },
        filters: [
          {
            text: "在用",
            value: true,
          },
          {
            text: "禁用",
            value: false,
          },
        ],
        onFilter: (value: boolean, record: UserI) => {
          return record.is_active === value;
        },
      },
      {
        title: "注册时间",
        dataIndex: "date_joined",
        key: "date_joined",
        render: (value: string) => {
          const dt = dayjs(new Date(value));
          return <span>{dt.format("YYYY-MM-DD")}</span>;
        },
        sorter: (a: UserI, b: UserI) => {
          if (a.date_joined && b.date_joined) {
            const a1 = new Date(a.date_joined).valueOf();
            const b1 = new Date(b.date_joined).valueOf();
            return a1 - b1;
          }
          return true;
        },
      },
      {
        title: "最新登录",
        dataIndex: "last_login",
        key: "last_login",
        render: (value: string) => {
          const dt = dayjs(new Date(value));
          return <span>{dt.locale("zh-cn").format("YYYY-MM-DD HH:mm")}</span>;
        },
        sorter: (a: UserI, b: UserI) => {
          if (a.last_login && b.last_login) {
            const a1 = new Date(a.last_login).valueOf();
            const b1 = new Date(b.last_login).valueOf();
            return a1 - b1;
          }
          return true;
        },
      },
      {
        title: "文件数量",
        dataIndex: "file_count",
        key: "cell_phone",
        sorter: (a: UserI, b: UserI) => {
          return a.file_count! - b.file_count!;
        },
      },
      {
        title: "文件容量",
        dataIndex: "volumn_count",
        key: "volumn_count",
        render: (value: number) => {
          return <span>{(value / (1024 * 1024)).toFixed(2)} M</span>;
        },
        sorter: (a: UserI, b: UserI) => {
          return a.volumn_count! - b.volumn_count!;
        },
      },
      // {
      //     title: "操作",
      //     key: "action",
      //     render: (text: any, record: UserI) => {
      //         return record.is_active ?
      //             <Button
      //                 size="small"
      //                 type="danger"
      //                 onClick={this.batchDeactivate([record.id.toString()])}
      //             >禁用</Button>
      //             :
      //             <Button
      //                 size="small"
      //                 type="primary"
      //                 onClick={this.batchActivate([record.id.toString()])}
      //             >启用</Button>
      //     }
      // }
    ];
    return (
      <div className="user-manage">
        <div className="user-manage-header">
          <h2>用户管理</h2>
        </div>
        <div className="search-box">
          <Form
            layout="inline"
            onFieldsChange={(val): void => {
              if (!val[0]) return;
              const { name, value } = val[0];

              let searchQuery = Object.assign({}, this.state.searchQuery);

              if (name.toString() === "dateRange") {
                const start = value ? value[0].format("YYYY-MM-DD HH:ss:mm") : "";
                const end = value ? value[1].format("YYYY-MM-DD HH:ss:mm") : "";

                searchQuery = Object.assign(searchQuery, { start, end });
              }

              if (name.toString() === "keyword") {
                searchQuery = Object.assign(searchQuery, { keyword: value });
              }

              this.setState({ searchQuery });
            }}
            onFinish={(vals: { dateRange: Dayjs[] | null; keyword: string }): void => {
              const { searchQuery } = this.state;
              this.fetchUserList(searchQuery);
            }}
          >
            <Form.Item label="检索词" name="keyword">
              <Input placeholder="手机号 | 昵称" />
            </Form.Item>
            <Form.Item label="选择时间范围" name="dateRange">
              <DatePicker.RangePicker></DatePicker.RangePicker>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="user-table">
          <Table
            // ref="user-manage-table"
            rowSelection={rowSelection}
            rowKey={(record) => {
              return record.id.toString();
            }}
            className="user-manage-table"
            columns={columns}
            dataSource={searchResult}
            pagination={{
              total: userTotal,
              onChange: (page) => {
                const nextSearchQuery = Object.assign({}, this.state.searchQuery, {
                  current: page,
                });
                this.setState({
                  searchQuery: nextSearchQuery,
                });

                this.fetchUserList(nextSearchQuery);
              },
            }}
            onRow={(record) => {
              return {
                onClick: (): void => {
                  // this.onClickItem(record.id);
                },
              };
            }}
          ></Table>
          <div className="user-manage-operate">
            <Button
              onClick={this.batchDeactivate}
              disabled={selectedRowKeys.length <= 0}
              style={{ margin: "10px" }}
            >
              批量禁用
            </Button>
            <Button
              onClick={this.batchActivate}
              disabled={selectedRowKeys.length <= 0}
              style={{ margin: "10px" }}
            >
              批量启用
            </Button>
            <Button
              onClick={this.batchDelete}
              disabled={selectedRowKeys.length <= 0}
              style={{ margin: "10px" }}
            >
              批量删除
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserManage;
