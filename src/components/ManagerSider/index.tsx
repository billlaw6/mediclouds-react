import React, { ReactNode } from "react";
import { SiderProps } from "antd/lib/layout";
import { FunctionComponent } from "react";
import { Menu, Layout } from "antd";
import { useHistory } from "react-router";

import { RoleE } from "_types/account";
import logo from "_assets/images/logo.png";

import {
  AreaChartOutlined,
  TeamOutlined,
  UserAddOutlined,
  BankOutlined,
  UserOutlined,
  AccountBookOutlined,
  PictureOutlined,
  AuditOutlined,
  InboxOutlined,
  QrcodeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import "./style.less";

const { Sider } = Layout;

interface ManagerSiderPropsI extends SiderProps {
  role?: RoleE;
  menuKey?: string;
}

const { Item: MenuItem } = Menu;

const ManagerSider: FunctionComponent<ManagerSiderPropsI> = (props) => {
  const history = useHistory();

  const { role = RoleE.EMPLOYEE, className, menuKey = "dashboard", ...siderProps } = props;

  const getMenuItem = (): ReactNode => {
    const AllUsers = (
      <MenuItem
        key="all-users"
        title="账号列表"
        icon={<TeamOutlined />}
        onClick={(): void => history.push("/manager/all-users")}
      >
        账号列表
      </MenuItem>
    );
    const Statistics = (
      <MenuItem
        key="dashboard"
        title="统计"
        icon={<AreaChartOutlined />}
        onClick={(): void => history.push("/manager")}
      >
        统计
      </MenuItem>
    );

    const CreateAccount = (
      <MenuItem
        key="create-account"
        title="创建账号"
        icon={<UserAddOutlined />}
        onClick={(): void => history.push("/manager/create-account")}
      >
        创建账号
      </MenuItem>
    );

    const BusinessAccount = (
      <MenuItem
        key="business-account-list"
        title="企业账户"
        icon={<BankOutlined />}
        onClick={(): void => history.push("/manager/business-account-list")}
      >
        企业账户
      </MenuItem>
    );

    const AccountList = (
      <MenuItem
        key="account-list"
        title="我的下属"
        icon={<TeamOutlined />}
        onClick={(): void => history.push("/manager/account-list")}
      >
        我的下属
      </MenuItem>
    );

    const CustomerList = (
      <MenuItem
        key="customer-list"
        title="我的顾客"
        icon={<UserOutlined />}
        onClick={(): void => history.push("/manager/customer-list")}
      >
        我的顾客
      </MenuItem>
    );

    const OrderList = (
      <MenuItem
        key="order-list"
        title="订单列表"
        icon={<AccountBookOutlined />}
        onClick={(): void => history.push("/manager/order-list")}
      >
        订单列表
      </MenuItem>
    );

    const HomeRes = (
      <MenuItem
        key="home-res"
        title="小程序首页图"
        icon={<PictureOutlined />}
        onClick={(): void => history.push("/manager/home-res")}
      >
        小程序首页图
      </MenuItem>
    );

    const MdEditor = (
      <MenuItem
        key="mdeditor"
        title="用户协议编辑"
        icon={<AuditOutlined />}
        onClick={(): void => history.push("/manager/mdeditor")}
      >
        用户协议编辑
      </MenuItem>
    );

    const Gallery = (
      <MenuItem
        key="gallery"
        title="公共图集"
        icon={<InboxOutlined />}
        onClick={(): void => history.push("/manager/gallery")}
      >
        公共图集
      </MenuItem>
    );

    const MyQrcode = (
      <MenuItem
        key="qrcode"
        title="我的二维码"
        icon={<QrcodeOutlined />}
        onClick={(): void => history.push("/manager/qrcode")}
      >
        我的二维码
      </MenuItem>
    );

    switch (role) {
      case RoleE.EMPLOYEE: {
        return [Statistics, CustomerList, OrderList, MyQrcode];
      }
      case RoleE.BUSINESS:
      case RoleE.MANAGER: {
        return [Statistics, CustomerList, AccountList, OrderList, CreateAccount, MyQrcode];
      }
      case RoleE.SUPER_ADMIN: {
        return [Statistics, CreateAccount, AllUsers, BusinessAccount, HomeRes, MdEditor, Gallery];
      }
      default:
        return [];
    }
  };

  return (
    <Sider className={`sider ${className}`} {...siderProps}>
      <div className="sider-logo" onClick={(): void => history.push("/manager")}>
        <img src={logo}></img>
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[menuKey]}>
        {getMenuItem()}
        <MenuItem key="account" icon={<SettingOutlined />}>
          <Link to="/manager/account-settings">账户设置</Link>
        </MenuItem>
      </Menu>
    </Sider>
  );
};

export default ManagerSider;
