import React, { FunctionComponent } from "react";
import { Layout, Avatar, Space } from "antd";

import ManagerSider from "_components/ManagerSider";

import { useSelector } from "react-redux";
import { StoreStateI } from "_types/core";
import { AccountI } from "_types/api";

import "./style.less";
import { UserOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

const ManagerLayout: FunctionComponent = (props) => {
  const account = useSelector<StoreStateI, AccountI>((state) => state.account);
  console.log("account", account);

  const { children } = props;

  return (
    <Layout id="managerLayout" className="manager-layout">
      <ManagerSider collapsible type={account.user_type}></ManagerSider>
      <Layout className="manager-layout-main">
        <Header className="manager-layout-header">
          <div className="manager-layout-title">后台管理</div>
          <div className="manager-layout-avatar">
            <Avatar src={account.avatar} icon={<UserOutlined></UserOutlined>}></Avatar>
            <span>欢迎{account.username}</span>
          </div>
        </Header>
        <Content className="manager-content">{children}</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
