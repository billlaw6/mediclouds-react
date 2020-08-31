/* 
  - 展示账户信息
  - 更新账户信息
  - 展示账户统计

*/

import React, { FunctionComponent, useState, ReactNode } from "react";
import { AccountI, RoleE, StatsI } from "_types/account";
import { Tabs, Row, Col, Input, Descriptions } from "antd";
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

const AccountInfo: FunctionComponent<AccountI> = (props) => {
  return <div>AccountInfo</div>;
};

const EditInfo: FunctionComponent<AccountI> = (props) => {
  return <div>EditInfo</div>;
};

const Account: FunctionComponent<AccountPropsI> = (props) => {
  const {
    role,
    id,
    business_name,
    nickname,
    username,
    recommended_users,
    first_name,
    last_name,
    cell_phone,
  } = props;

  const [currentTabKey, setCurrentTabKey] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [preUpdateData, setPreUpdateData] = useState<{ [key: string]: any }>({});
  const [stats, setStats] = useState<StatsI>();

  const getVal: GetValI = (key) => {
    return preUpdateData[key] || props[key];
  };
  const setVal: SetValI = (key, val) => {
    const nextData = Object.assign({}, preUpdateData, { [key]: val });
    setPreUpdateData(nextData);
  };

  const updateAccount = (): void => {
    //

    setEditMode(false);
  };

  const accountStats = (): ReactNode => {
    if (!stats) return null;

    return [
      <DescItem key="case" label="病例数">
        {stats.case}
      </DescItem>,
      <DescItem key="customer" label="用户数">
        {stats.customer}
      </DescItem>,
      <DescItem key="custodicom_sizemer" label="dicom数量">
        {stats.dicom_size}
      </DescItem>,
      <DescItem key="pdf_size" label="pdf数量">
        {stats.pdf_size}
      </DescItem>,
      <DescItem key="image_size" label="图片数量">
        {stats.image_size}
      </DescItem>,
      <DescItem key="order" label="订单量">
        {stats.order}
      </DescItem>,
    ];
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
            <SyncOutlined className="account-ctl-icon" alt="刷新" />
          </div>
          <Descriptions>{accountStats()}</Descriptions>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Account;
