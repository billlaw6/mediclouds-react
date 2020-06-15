import React, { ReactElement } from "react";
import { Table, Button, Form, Input, Row, Col } from "antd";
import moment, { Moment } from "moment";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import "./Dashboard.less";
import UserStats from "./components/UserStats";
import DicomStats from "./components/DicomStats";
import { UserI } from "_constants/interface";
import { RouteComponentProps } from "react-router";

export interface MapStateToPropsI {
  user: UserI;
}

export type DashboardPropsI = MapStateToPropsI & RouteComponentProps;
export interface DashboardStateI {
  openKeys: string[];
  rootSubmenuKeys: string[];
}

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class Dashboard extends React.Component<DashboardPropsI, DashboardStateI> {
  constructor(props: DashboardPropsI) {
    super(props);
    this.state = {
      openKeys: [],
      rootSubmenuKeys: ["sub1", "sub2", "sub3"],
    };
  }

  fetchDashboard = (): void => {
    const params = {
      start: "2020-03-20",
      end: "2020-04-01",
    };
  };

  onOpenChange = (openKeys: string[]) => {
    const { rootSubmenuKeys } = this.state;
    const latestOpenKey = openKeys.find((key) => this.state.openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };

  componentDidMount(): void {
    this.fetchDashboard();
  }

  render(): ReactElement {
    const { user } = this.props;

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>管理看板</h2>
        </div>
        <Row>
          <Col xs={{ span: 6 }} lg={{ span: 4 }}>
            <div className="dashboard-input">
              <a href="/users">用户管理</a>
            </div>
            <div className="dashboard-input">
              <a href="/mdeditor">用户协议编辑器</a>
            </div>
            <div className="dashboard-input">
              <a href="/gallery">公共影像集</a>
            </div>
            <div className="dashboard-input">
              <a href="/home-res">首页轮播图编辑</a>
            </div>
          </Col>
          <Col xs={{ span: 18 }} lg={{ span: 20 }}>
            <Row>
              <Col span={24}>
                <UserStats></UserStats>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <DicomStats></DicomStats>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
