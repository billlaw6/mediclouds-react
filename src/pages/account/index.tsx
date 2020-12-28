import React, { FunctionComponent, useState } from "react";
import { message, Tabs } from "antd";
import useAccount from "_hooks/useAccount";
import { RoleE } from "mc-api";

import { Store } from "antd/lib/form/interface";

import Avatar from "./Avatar";
import ChangePassword from "./ChangePassword";
import ChangeCellPhone from "./ChangeCellPhone";
import Certificate from "./Certificate";
import Info from "./Info";

import "./style.less";

const { TabPane } = Tabs;

const Account: FunctionComponent = () => {
  const { account, updateAccount } = useAccount();

  const { role } = account;
  const [currentTab, setCurrentTab] = useState("info");

  const _update = (vals: Store): void => {
    updateAccount(vals, account.id)
      .then(() => {
        message.success("更新成功！");
      })
      .catch((err) => {
        console.error("error", err);
        message.error("更新失败，请重试");
      });
  };

  return (
    <div className="account">
      <Tabs className="account-tabs" activeKey={currentTab} onChange={(val) => setCurrentTab(val)}>
        <TabPane key="info" tab="账户信息">
          <Info account={account} onFinish={_update}></Info>
        </TabPane>
        <TabPane key="avatar" tab="头像">
          <Avatar account={account} onFinish={_update}></Avatar>
        </TabPane>
        <TabPane key="password" tab="密码">
          {currentTab === "password" ? (
            <ChangePassword account={account} onFinish={_update} />
          ) : null}
        </TabPane>
        <TabPane key="cell_phone" tab="手机号">
          {currentTab === "cell_phone" ? (
            <ChangeCellPhone account={account} onFinish={_update} />
          ) : null}
        </TabPane>
        {role === RoleE.BUSINESS ? (
          <TabPane key="cert" tab="企业资质">
            <Certificate account={account} onFinish={_update}></Certificate>
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};

export default Account;
