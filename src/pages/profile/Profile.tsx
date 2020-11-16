import React, { FunctionComponent, useEffect } from "react";

import useAccount from "_hooks/useAccount";
import { Tabs } from "antd";

/** components */
import Header from "./components/Header";

/** styles */
import "./Profile.less";
import Info from "./components/Info";
import Score from "./components/Score";
import Avatar from "./components/Avatar";
import Security from "./components/Security";

const { TabPane } = Tabs;

const Profile: FunctionComponent = (props) => {
  const { account } = useAccount();

  /* render */
  return (
    <section className="profile">
      <Header></Header>
      <div className="profile-content">
        <Tabs defaultActiveKey="info" tabPosition="left">
          <TabPane key="info" tab="个人信息">
            <Info data={account}></Info>
          </TabPane>
          <TabPane key="security" tab="安全">
            <Security value={account.cell_phone}></Security>
          </TabPane>
          <TabPane key="avatar" tab="头像">
            <Avatar src={account.avatar}></Avatar>
          </TabPane>
          <TabPane key="score" tab="积分">
            <Score value={account.score}></Score>
          </TabPane>
        </Tabs>
      </div>
    </section>
  );
};

export default Profile;
