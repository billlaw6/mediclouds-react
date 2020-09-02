import React, { useState } from "react";
import { SiderProps } from "antd/lib/layout";
import { FunctionComponent } from "react";
import { Menu, Layout } from "antd";
import { useHistory } from "react-router";

import { RoleE } from "_types/account";
import logo from "_assets/images/logo.png";
import "./style.less";

const { Sider } = Layout;

interface ManagerSiderPropsI extends SiderProps {
  role?: RoleE;
  menuKey?: string;
}

const { Item: MenuItem, ItemGroup: MenuItemGroup, SubMenu } = Menu;

const ManagerSider: FunctionComponent<ManagerSiderPropsI> = (props) => {
  const history = useHistory();

  const { role = RoleE.EMPLOYEE, className, menuKey = "dashboard", ...siderProps } = props;

  console.log("menu key", menuKey);
  return (
    <Sider className={`sider ${className}`} {...siderProps}>
      <div className="sider-logo" onClick={() => history.push("/manager")}>
        <img src={logo}></img>
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[menuKey]}>
        <MenuItem key="dashboard" title="统计" onClick={(): void => history.push("/manager")}>
          统计
        </MenuItem>
        <MenuItem
          key="create-account"
          title="创建账号"
          onClick={(): void => history.push("/manager/create-account")}
        >
          创建账号
        </MenuItem>
        <MenuItem
          key="business-account-list"
          title="企业账户"
          onClick={(): void => history.push("/manager/business-account-list")}
        >
          企业账户
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
        <MenuItem
          key="order-list"
          title="订单列表"
          onClick={(): void => history.push("/manager/order-list")}
        >
          订单列表
        </MenuItem>
      </Menu>
    </Sider>
  );
};

export default ManagerSider;
