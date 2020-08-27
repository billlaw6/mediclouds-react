import React from "react";
import { SiderProps } from "antd/lib/layout";
import { FunctionComponent } from "react";
import { Menu, Layout } from "antd";
import { useHistory } from "react-router";

import { AccountTypeE } from "_types/api";
import logo from "_assets/images/logo.png";
import "./style.less";

const { Sider } = Layout;

interface ManagerSiderPropsI extends SiderProps {
  type?: AccountTypeE;
}

const { Item: MenuItem, ItemGroup: MenuItemGroup, SubMenu } = Menu;

const ManagerSider: FunctionComponent<ManagerSiderPropsI> = (props) => {
  const history = useHistory();
  console.log("history", history);
  const { type = AccountTypeE.STAFF, className, ...siderProps } = props;

  return (
    <Sider className={`sider ${className}`} {...siderProps}>
      <div className="sider-logo">
        <img src={logo}></img>
      </div>
      <Menu theme="dark" mode="inline">
        <SubMenu title="用户管理">
          <MenuItem key="create-account" title="创建用户">
            创建用户
          </MenuItem>
          <MenuItem key="list-account" title="用户列表">
            用户列表
          </MenuItem>
        </SubMenu>
        <MenuItem key="customer" title="我的顾客">
          我的顾客
        </MenuItem>
      </Menu>
    </Sider>
  );
};

export default ManagerSider;
