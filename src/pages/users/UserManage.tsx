import React, { ReactElement } from "react";
import { Table, Button } from "antd";
import moment, { Moment } from "moment";
import { UserI } from "_constants/interface";
import { getUserList } from "_services/user";
import { TableEventListeners } from "antd/lib/table";
import { UserManagePropsI, UserManageStateI } from "_pages/users/type";

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class UserManage extends React.Component<UserManagePropsI, UserManageStateI> {
    constructor(props: UserManagePropsI) {
        super(props);
        this.state = {
            userList: [],
            selectedRowKeys: [],
        }
    }

    componentDidMount(): void {
        getUserList().then((res: any) => {
            console.log(res);
            this.setState({ userList: res.data });
        }).catch((err: any) => {
            console.error(err);
        })
    }


    render(): ReactElement {
        const { user } = this.props;
        const { selectedRowKeys, userList } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys: any, selectedRows: UserI[]) => {
                console.log(selectedRowKeys);
                this.setState({ selectedRowKeys });
            }
        }
        const columns: any = [
            {
                title: "昵称",
                dataIndex: "nickname",
                key: "nickname",
                sorter: (a: UserI, b: UserI) => {
                    return a.nickname.localeCompare(b.nickname, "zh-CN");
                }
            },
            {
                title: "手机号",
                dataIndex: "cell_phone",
                key: "cell_phone",
                sorter: (a: UserI, b: UserI) => {
                    return a.cell_phone.localeCompare(b.cell_phone, "zh-CN");
                }
            },
            // {
            //     title: "年龄",
            //     dataIndex: "age",
            //     key: "age",
            //     sorter: (a: UserI, b: UserI) => {
            //         return a.age > b.age;
            //     }
            // },
            {
                title: "是否有效",
                dataIndex: "is_active",
                key: "is_active",
            },
            {
                title: "操作",
                key: "action",
                render: (text: any, record: UserI) => {
                    return record.is_active ?
                        <span>
                            <a>禁用</a>
                        </span>
                        :
                        <span>
                            <a>启用</a>
                        </span>
                }
            }
        ]
        return (
            <Table
                ref="user-manage-table"
                rowSelection={rowSelection}
                className="user-manage-table"
                columns={columns}
                dataSource={userList}
                onRow={(record): TableEventListeners => {
                    return {
                        onClick: (): void => {
                            // this.onClickItem(record.id);
                        }
                    }
                }}
            ></Table>
        )
    }
}

export default UserManage;