import React, { FunctionComponent, ReactNode } from "react";
import { Layout, Avatar, Space } from "antd";

import ManagerSider from "_components/ManagerSider";

import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { AccountI } from "_types/account";

import { UserOutlined } from "@ant-design/icons";
import Manager from "_pages/manager";
import { useParams } from "react-router";
import ManagerCreateAccount from "_pages/createAccount";
import ManagerAccountList from "_pages/accountList";
import ManagerCustomerList from "_pages/customerList";

import "./style.less";
import BusinessAccountList from "_pages/businessAccountLIst";
import OrderList from "_pages/orderList";

const { Header, Footer, Content } = Layout;

const ManagerLayout: FunctionComponent = () => {
  const account = useSelector<StoreStateI, AccountI>((state) => state.account);
  const { name } = useParams();

  const getContent = (): ReactNode => {
    switch (name) {
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
            <Avatar src={account.avatar} icon={<UserOutlined></UserOutlined>}></Avatar>
            <span>欢迎{account.username}</span>
          </div>
        </Header>
        <Content className="manager-layout-content">{getContent()}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
