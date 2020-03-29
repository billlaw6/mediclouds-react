import React, { ReactElement } from "react";
import { Table, Icon, Button, Form, Input } from "antd";
import moment, { Moment } from "moment";
import { UserI } from "_constants/interface";
import { getUserList, deactivateUsers, activateUsers } from "_services/user";
import { TableEventListeners } from "antd/lib/table";
import { UserManagePropsI, UserManageStateI } from "_pages/users/type";
import "./UserManage.less";

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class UserManage extends React.Component<UserManagePropsI, UserManageStateI> {
  constructor(props: UserManagePropsI) {
    super(props);
    this.state = {
      userList: [],
      searchResult: [],
      selectedRowKeys: [],
    };
  }

  fetchUserList = (): void => {
    getUserList()
      .then((res: any) => {
        // console.log(res);
        this.setState({ userList: res.data });
        this.setState({ searchResult: res.data });
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  searchUser = (e: any): void => {
    const { userList } = this.state;
    const { value } = e.target;
    if (value) {
      const searchResult = userList.filter((item: UserI) => {
        // console.log(item.nickname.toLowerCase().indexOf(value.toLowerCase()));
        if (
          item.nickname.toLowerCase().indexOf(value.toLowerCase()) >= 0 ||
          item.cell_phone.toLowerCase().indexOf(value.toLowerCase()) >= 0
        ) {
          return true;
        }
      });
      this.setState({ searchResult: searchResult });
    } else {
      this.setState({ searchResult: userList });
    }
  };

  componentDidMount(): void {
    this.fetchUserList();
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
          this.fetchUserList();
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
          this.fetchUserList();
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  render(): ReactElement {
    const { user } = this.props;
    const { selectedRowKeys, searchResult } = this.state;
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
          return a.cell_phone.localeCompare(b.cell_phone, "zh-CN");
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
          <Form layout="inline">
            <Form.Item label="检索词">
              <Input
                prefix={<Icon type="key" style={{ color: "rgba(0,0,0, .25)" }} />}
                type="text"
                placeholder="手机号 | 昵称"
                onChange={this.searchUser}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="user-table">
          <Table
            ref="user-manage-table"
            rowSelection={rowSelection}
            rowKey={record => {
              return record.id.toString();
            }}
            className="user-manage-table"
            columns={columns}
            dataSource={searchResult}
            onRow={(record): TableEventListeners => {
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
          </div>
        </div>
      </div>
    );
  }
}

export default UserManage;
