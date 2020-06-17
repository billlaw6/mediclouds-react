/* eslint-disable @typescript-eslint/camelcase */
import React, { ReactElement } from "react";
import { Row, Col, Layout, Menu } from "antd";
import { UserOutlined, CopyOutlined, CameraOutlined, DesktopOutlined } from "@ant-design/icons";
import { getUserStats } from "_services/user";
import { getDicomFileStats } from "_services/dicom";

import logo from "_assets/images/logo.png";
import "./Dashboard.less";
interface UserStatsI {
  dt: string;
  rc: number;
}

interface DicomStatsI {
  dt: string;
  daily_count: number;
}

export interface DashboardStateI {
  openKeys: string[];
  rootSubmenuKeys: string[];
  openSider: boolean;
  userStats: {
    total_count: number;
    daily_count: UserStatsI[];
  };
  dicomStats: {
    total_pictures: number;
    daily_pictures: DicomStatsI[];
  };
}

class Dashboard extends React.Component<{}, DashboardStateI> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userStats: {
        total_count: 0,
        daily_count: [],
      },
      dicomStats: {
        total_pictures: 0,
        daily_pictures: [],
      },
      openKeys: [],
      openSider: true,
      rootSubmenuKeys: ["sub1", "sub2", "sub3"],
    };
  }

  componentDidMount(): void {
    this.syncStats()
      .then((res) => {
        this.setState(res);
      })
      .catch((err) => console.error(err));
  }

  syncStats = async () => {
    const userStatsRes = await getUserStats();
    const dicomStatsRes = await getDicomFileStats();

    return {
      userStats: userStatsRes.data,
      dicomStats: dicomStatsRes.data,
    };
  };

  render(): ReactElement {
    const { userStats, dicomStats } = this.state;
    const { total_count: userTotal, daily_count: userDaily } = userStats;
    const { total_pictures: dicomTotal, daily_pictures: dicomDaily } = dicomStats;

    return (
      <Layout className="dashboard">
        <Layout.Sider
          collapsible
          collapsed={!this.state.openSider}
          onCollapse={(): void => this.setState({ openSider: !this.state.openSider })}
        >
          <div className="dashboard-logo">
            <img src={logo} alt="logo" />
          </div>
          <Menu theme="dark" mode="inline">
            <Menu.Item key="users" icon={<UserOutlined></UserOutlined>}>
              <a href="/users">用户管理</a>
            </Menu.Item>
            <Menu.Item key="mdeditor" icon={<CopyOutlined />}>
              <a href="/mdeditor">用户协议编辑器</a>
            </Menu.Item>
            <Menu.Item key="gallery" icon={<CameraOutlined />}>
              <a href="/gallery">公共影像集</a>
            </Menu.Item>
            <Menu.Item key="home-res" icon={<DesktopOutlined />}>
              <a href="/home-res">首页轮播图编辑</a>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout>
          <Layout.Header>
            <h2 style={{ color: "#fff" }}>管理看板</h2>
          </Layout.Header>
          <Layout.Content className="dashboard-content">
            <Row gutter={16}>
              <Col className="stats-item" span={6}>
                <h3 className="stats-item-title">总用户数</h3>
                <div className="stats-item-content">
                  <b>{userTotal}</b> 人
                </div>
              </Col>
              <Col className="stats-item" span={6}>
                <h3 className="stats-item-title">当日新增用户数</h3>
                <div className="stats-item-content">
                  <b>{userDaily.length ? userDaily.reverse()[0].rc : 0}</b> 人
                </div>
              </Col>
              <Col className="stats-item" span={6}>
                <h3 className="stats-item-title">影像图片累计</h3>
                <div className="stats-item-content">
                  <b>{dicomTotal}</b> 张
                </div>
              </Col>
              <Col className="stats-item" span={6}>
                <h3 className="stats-item-title">当日影像图片</h3>
                <div className="stats-item-content">
                  <b>{dicomDaily.length ? Math.round(dicomDaily.reverse()[0].daily_count) : 0}</b>{" "}
                  张
                </div>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default Dashboard;
