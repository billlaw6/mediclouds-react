import React, { FunctionComponent, ReactNode } from "react";
import { Layout, Avatar, Space, Dropdown, Menu } from "antd";

import ManagerSider from "_components/ManagerSider";

import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { AccountI, RoleE } from "_types/account";

import { UserOutlined } from "@ant-design/icons";
import Manager from "_pages/manager";
import { useParams } from "react-router";
import ManagerCreateAccount from "_pages/createAccount";
import ManagerAccountList from "_pages/accountList";
import ManagerCustomerList from "_pages/customerList";

import "./style.less";
import BusinessAccountList from "_pages/businessAccountLIst";
import OrderList from "_pages/orderList";
import Account from "_pages/account";
import { Link } from "react-router-dom";
import AccountRole from "_components/AccountRole";

const { Header, Footer, Content } = Layout;

const ManagerLayout: FunctionComponent = () => {
  const account = useSelector<StoreStateI, AccountI>((state) => state.account);
  const { name } = useParams();

  const { role, first_name, last_name, business_name } = account;

  const getContent = (): ReactNode => {
    switch (name) {
      case "account-settings":
        return <Account></Account>;
      case "create-account":
        return <ManagerCreateAccount></ManagerCreateAccount>;
      case "business-account-list":
        return <BusinessAccountList></BusinessAccountList>;
      case "account-list":
        return <ManagerAccountList></ManagerAccountList>;
      case "customer-list":
        return <ManagerCustomerList></ManagerCustomerList>;
      case "order-list":
        return <OrderList></OrderList>;
      default:
        return <Manager></Manager>;
    }
  };

  return (
    <Layout id="managerLayout" className="manager-layout">
      <ManagerSider collapsible role={account.role} menuKey={name}></ManagerSider>
      <Layout className="manager-layout-main">
        <Header className="manager-layout-header">
          <div className="manager-layout-title">后台管理</div>
          <div className="manager-layout-avatar">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="account">
                    <Link to="/manager/account-settings">账户设置</Link>
                  </Menu.Item>
                </Menu>
              }
            >
              <Avatar
                shape="square"
                src={account.avatar}
                icon={<UserOutlined></UserOutlined>}
                style={{ marginRight: "12px" }}
              ></Avatar>
            </Dropdown>
            <Space align="baseline">
              <span>
                欢迎{role === RoleE.BUSINESS ? business_name : `${first_name}${last_name}`}
              </span>
              <AccountRole role={role}></AccountRole>
            </Space>
          </div>
        </Header>
        <Content className="manager-layout-content">{getContent()}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
