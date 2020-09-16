import React, { FunctionComponent, ReactNode } from "react";
import { Layout, Space, Alert } from "antd";

import ManagerSider from "_components/ManagerSider";
import { RoleE } from "_types/account";

import { WarningOutlined } from "@ant-design/icons";
import Manager from "_pages/manager";
import { useParams } from "react-router";
import ManagerCreateAccount from "_pages/createAccount";
import ManagerAccountList from "_pages/accountList";
import ManagerCustomerList from "_pages/customerList";

import BusinessAccountList from "_pages/businessAccountLIst";
import OrderList from "_pages/orderList";
import Account from "_pages/account";
import { useHistory } from "react-router-dom";
import AccountRole from "_components/AccountRole";
import HomeResource from "_pages/homeResource/HomeResource";
import MdEditor from "_pages/mdEditor/MdEditor";
import Gallery from "_pages/gallery/Gallery";
import useAccount from "_hooks/useAccount";
import Qrcode from "_pages/qrcode";
import UserList from "_pages/userList";

import "./style.less";

const { Header, Content } = Layout;

const ManagerLayout: FunctionComponent = () => {
  const { account, logout } = useAccount();
  const { name } = useParams<{ name: string }>();

  const { role, first_name, last_name, business_name, certificate } = account;

  const getContent = (): ReactNode => {
    switch (name) {
      case "all-users":
        return <UserList></UserList>;
      case "qrcode":
        return <Qrcode></Qrcode>;
      case "gallery":
        return <Gallery></Gallery>;
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
      case "mdeditor":
        return <MdEditor></MdEditor>;
      case "home-res":
        return <HomeResource></HomeResource>;
      default:
        return <Manager></Manager>;
    }
  };

  console.log("account", account);

  return (
    <Layout id="managerLayout" className="manager-layout">
      <ManagerSider collapsible role={account.role} menuKey={name}></ManagerSider>
      <Layout className="manager-layout-main">
        <Header className="manager-layout-header">
          <div className="manager-layout-title">后台管理</div>
          <div className="manager-layout-avatar">
            <Space align="baseline">
              <span>
                欢迎{role === RoleE.BUSINESS ? business_name : `${first_name}${last_name}`}
              </span>
              <AccountRole role={role}></AccountRole>
              <span
                className="manager-layout-logout"
                onClick={(): void => {
                  logout()
                    .then((): void => console.log("logout successed"))
                    .catch((err) => console.log(err));
                }}
              >
                退出登录
              </span>
            </Space>
          </div>
        </Header>
        {!certificate.length && role === RoleE.BUSINESS ? (
          <Alert
            type="warning"
            message="您的企业资质未上传或未通过审核，部分功能受限。"
            style={{ marginBottom: "20px" }}
          >
            <WarningOutlined />
          </Alert>
        ) : null}
        <Content className="manager-layout-content">{getContent()}</Content>
        {/* <Footer>
          <span>北京医影云医疗技术有限公司</span>
          <CopyrightCircleOutlined />
          <span>2020</span>
          <span>
            <a
              href="https://mi.mediclouds.cn/mc-privacy-notice/"
              target="_blank"
              rel="noopener noreferrer"
            >
              《用户协议》
            </a>
          </span>
          <a href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
            京ICP备19054124号-1
          </a>
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default ManagerLayout;
