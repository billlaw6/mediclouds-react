import React, { ReactElement } from "react";
import { Table, Icon, Button, Form, Input } from "antd";
import moment, { Moment } from "moment";
// import { getDashboardType, getDashboard, createDashboard } from "_services/user";
import { TableEventListeners } from "antd/lib/table";
import { DashboardPropsI, DashboardStateI } from "./type";
import "./Dashboard.less";

const dateFormat = "YYYY-MM-DD HH:mm:ss";

class Dashboard extends React.Component<DashboardPropsI, DashboardStateI> {
  constructor(props: DashboardPropsI) {
    super(props);
    this.state = {
      dashboard: [],
    };
  }

  fetchDashboard = (): void => {
    const params = {
      start: "2020-03-20",
      end: "2020-04-01",
    };
  };

  componentDidMount(): void {
    this.fetchDashboard();
  }

  // getTableRowKey = (record: UserI): string => {
  //     return record.id.toString();
  // }

  render(): ReactElement {
    const { user } = this.props;

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>管理看板</h2>
        </div>
        <div className="dashboard-input">
          <a href="/users">用户管理</a>
        </div>
      </div>
    );
  }
}

export default Dashboard;
