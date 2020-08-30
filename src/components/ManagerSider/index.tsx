import React, { useState } from "react";
import { SiderProps } from "antd/lib/layout";
import { FunctionComponent } from "react";
import { Menu, Layout } from "antd";
import { useHistory } from "react-router";

import { AccountTypeE, CustomerTypeE } from "_types/api";
import logo from "_assets/images/logo.png";
import "./style.less";

const { Sider } = Layout;

interface ManagerSiderPropsI extends SiderProps {
  type?: AccountTypeE | CustomerTypeE;
  menuKey?: string;
}

const { Item: MenuItem, ItemGroup: MenuItemGroup, SubMenu } = Menu;

const ManagerSider: FunctionComponent<ManagerSiderPropsI> = (props) => {
  const history = useHistory();

  const { type = AccountTypeE.EMPLOYEE, className, menuKey = "", ...siderProps } = props;

  console.log("menu key", menuKey);
  return (
    <Sider className={`sider ${className}`} {...siderProps}>
      <div className="sider-logo" onClick={() => history.push("/manager")}>
        <img src={logo}></img>
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[menuKey]}>
        <MenuItem
          key="create-account"
          title="创建账号"
          onClick={(): void => history.push("/manager/create-account")}
        >
          创建账号
        </MenuItem>
        <MenuItem
          key="account-list"
          title="账号列表"
          onClick={(): void => history.push("/manager/account-list")}
        >
          账号列表
        </MenuItem>
        <MenuItem
          key="customer-list"
          title="我的用户"
          onClick={(): void => history.push("/manager/customer-list")}
        >
          我的用户
        </MenuItem>
      </Menu>
    </Sider>
  );
};

export default ManagerSider;
