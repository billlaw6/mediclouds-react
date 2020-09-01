/* eslint-disable no-unreachable */
/* 
  - 展示账户信息
  - 更新账户信息
  - 展示账户统计

*/

import React, { FunctionComponent, useState, ReactNode, useEffect } from "react";
import { AccountI, RoleE, StatsI } from "_types/account";
import { Tabs, Row, Col, Input, Descriptions, Statistic, Card, Spin } from "antd";
import { EditOutlined, SyncOutlined, SaveOutlined } from "@ant-design/icons";

import "./style.less";
import { getStats } from "_api/user";

interface AccountPropsI extends AccountI {
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

export const AccountStats: FunctionComponent<{ role: RoleE; stats: StatsI | null }> = (props) => {
  const { stats, role } = props;

  if (!stats) return null;

  return (
    <>
      <Row gutter={[16, 16]}>
        {role === RoleE.BUSINESS || role === RoleE.MANAGER ? (
          <Col key="account" span={12}>
            <Card>
              <Statistic title="员工数" value={stats.account} suffix="人"></Statistic>
            </Card>
          </Col>
        ) : null}
        <Col key="customer" span={12}>
          <Card>
            <Statistic title="用户数" value={stats.customer} suffix="人"></Statistic>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col key="case" span={12}>
          <Card>
            <Statistic title="病例数" value={stats.case} suffix="例"></Statistic>
          </Card>
        </Col>
        <Col key="order" span={12}>
          <Card>
            <Statistic title="订单量" value={stats.order} suffix="个"></Statistic>
          </Card>
        </Col>
      </Row>
      {role === RoleE.BUSINESS ? (
        <Row gutter={[16, 16]}>
          <Col key="custodicom_sizemer" span="8">
            <Card>
              <Statistic
                title="dicom磁盘空间"
                value={stats.dicom_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
          <Col key="pdf_size" span="8">
            <Card>
              <Statistic
                title="pdf磁盘空间"
                value={stats.pdf_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
          <Col key="image_size" span="8">
            <Card>
              <Statistic
                title="图片磁盘空间"
                value={stats.image_size}
                precision={2}
                suffix="MB"
              ></Statistic>
            </Card>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

const Account: FunctionComponent<AccountPropsI> = (props) => {
  const { role, id, business_name, username, recommended_users, cell_phone } = props;

  const [currentTabKey, setCurrentTabKey] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [preUpdateData, setPreUpdateData] = useState<{ [key: string]: any }>({});
  const [stats, setStats] = useState<StatsI | null>(null);

  const getVal: GetValI = (key) => {
    const res = preUpdateData[key] || props[key];
    if (key === "sex") {
      switch (res) {
        case 1:
          return "男";
        case 2:
          return "女";
        default:
          return "保密";
      }
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
        <Input bordered={false} disabled={!editMode} value={getVal("first_name")}></Input>
      </DescItem>,
      <DescItem key="last_name" label="名">
        <Input bordered={false} disabled={!editMode} value={getVal("last_name")}></Input>
      </DescItem>,
      <DescItem key="nickname" label="昵称">
        <Input bordered={false} disabled={!editMode} value={getVal("nickname")}></Input>
      </DescItem>,
      <DescItem key="address" label="地址">
        <Input bordered={false} disabled={!editMode} value={getVal("address")}></Input>
      </DescItem>,
      <DescItem key="sex" label="性别">
        {getVal("sex")}
      </DescItem>,
      <DescItem key="age" label="年龄">
        <Input bordered={false} disabled={!editMode} value={getVal("age")}></Input>
      </DescItem>,
      <DescItem key="sign" label="签名">
        <Input bordered={false} disabled={!editMode} value={getVal("sign")}></Input>
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
              <SaveOutlined className="account-ctl-icon" alt="保存" onClick={updateAccount} />
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
      </Tabs>
    </div>
  );
};

export default Account;
