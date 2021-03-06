/* eslint-disable no-unreachable */
/* 
  - 展示账户信息
  - 更新账户信息
  - 展示账户统计

*/

import React, { FunctionComponent, useState, ReactNode } from "react";
import { Tabs, Input, Descriptions, Spin, DatePicker, Space } from "antd";
import { EditOutlined, SyncOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { getStats, UserI, RoleE, StatsI } from "mc-api";
import AccountList from "_components/AccountList";
import AccountStats from "./AccountStats";
import { getSexName } from "_helper";

import "./style.less";

interface AccountPropsI extends UserI {
  [key: string]: any;
}

interface GetValI {
  <T = any>(key: string): T;
}
interface SetValI {
  <T = any>(key: string, val: T): void;
}

const { Item: DescItem } = Descriptions;
const { TabPane } = Tabs;

const Account: FunctionComponent<AccountPropsI> = (props) => {
  const { role, id, business_name, username, recommended_users, cell_phone } = props;

  const [currentTabKey, setCurrentTabKey] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [preUpdateData, setPreUpdateData] = useState<{ [key: string]: any }>({});
  const [stats, setStats] = useState<StatsI | null>(null);

  const getVal: GetValI = (key) => {
    const res = preUpdateData[key] || props[key];
    if (key === "sex") {
      return getSexName(res);
    }
    return res;
  };
  const setVal: SetValI = (key, val) => {
    const nextData = Object.assign({}, preUpdateData, { [key]: val });
    setPreUpdateData(nextData);
  };

  const updateAccount = (): void => {
    //

    setEditMode(false);
  };

  const getDescItem = (): ReactNode => {
    const Basic = [
      <DescItem key="id" label="id">
        {id}
      </DescItem>,
      <DescItem key="username" label="用户名">
        {username}
      </DescItem>,
      <DescItem key="cell_phone" label="手机号">
        {cell_phone}
      </DescItem>,
    ];
    const Business = [
      <DescItem key="business_name" label="企业名称">
        {business_name}
      </DescItem>,
    ];

    if (role === RoleE.BUSINESS) return [...Basic, ...Business];
    return [
      ...Basic,
      <DescItem key="first_name" label="姓">
        <Input
          bordered={editMode ? true : false}
          disabled={!editMode}
          value={getVal("first_name")}
          onChange={(e): void => setVal("first_name", e.currentTarget.value)}
        ></Input>
      </DescItem>,
      <DescItem key="last_name" label="名">
        <Input
          bordered={editMode ? true : false}
          disabled={!editMode}
          value={getVal("last_name")}
          onChange={(e): void => setVal("last_name", e.currentTarget.value)}
        ></Input>
      </DescItem>,
      <DescItem key="nickname" label="昵称">
        <Input
          bordered={editMode ? true : false}
          disabled={!editMode}
          value={getVal("nickname")}
          onChange={(e): void => setVal("nickname", e.currentTarget.value)}
        ></Input>
      </DescItem>,
      <DescItem key="address" label="地址">
        <Input
          bordered={editMode ? true : false}
          disabled={!editMode}
          value={getVal("address")}
          onChange={(e): void => setVal("address", e.currentTarget.value)}
        ></Input>
      </DescItem>,
      <DescItem key="sex" label="性别">
        {getVal("sex")}
      </DescItem>,
      <DescItem key="age" label="年龄">
        {editMode ? (
          <DatePicker
            onChange={(val) => val && setVal("birthday", val.format("YYYY-MM-DD"))}
          ></DatePicker>
        ) : (
          getVal("age")
        )}
      </DescItem>,
      <DescItem key="sign" label="签名">
        <Input
          bordered={editMode ? true : false}
          disabled={!editMode}
          value={getVal("sign")}
          onChange={(e) => setVal("sign", e.currentTarget.value)}
        ></Input>
      </DescItem>,
      <DescItem key="recommended_users" label="邀请人数">
        {recommended_users.length}
      </DescItem>,
    ];
  };

  return (
    <div className="account">
      <Tabs
        activeKey={currentTabKey}
        onChange={(key): void => {
          setCurrentTabKey(key);
          if (key === "stats")
            getStats(id)
              .then((res) => setStats(res))
              .catch((err) => console.error(err));
        }}
      >
        <TabPane tab="账户信息" key="info">
          <div className="account-ctl">
            {editMode ? (
              <Space>
                <CloseOutlined
                  alt="取消"
                  onClick={(): void => {
                    setPreUpdateData({});
                    setEditMode(false);
                  }}
                />
                <SaveOutlined className="account-ctl-icon" alt="保存" onClick={updateAccount} />
              </Space>
            ) : (
              <EditOutlined
                className="account-ctl-icon"
                alt="编辑"
                onClick={(): void => setEditMode(true)}
              />
            )}
          </div>
          <div className="account-content">
            <Descriptions bordered>{getDescItem()}</Descriptions>
          </div>
        </TabPane>
        {role === RoleE.PATIENT || role === RoleE.DOCTOR ? null : (
          <TabPane tab="统计信息" key="stats">
            <div className="account-ctl">
              <SyncOutlined
                className="account-ctl-icon"
                alt="刷新"
                onClick={(): void => {
                  setStats(null);

                  getStats(id)
                    .then((res) => setStats(res))
                    .catch((err) => console.error(err));
                }}
              />
            </div>
            <div className="account-stats-content">
              {stats ? (
                <AccountStats stats={stats} role={role}></AccountStats>
              ) : (
                <div className="account-loading">
                  <Spin></Spin>
                </div>
              )}
            </div>
          </TabPane>
        )}
        {role === RoleE.BUSINESS ? (
          <TabPane tab="员工" key="employeeList">
            <AccountList id={id} viewable={false}></AccountList>
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};

export default Account;
