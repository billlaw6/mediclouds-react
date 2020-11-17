import React, { FunctionComponent, useEffect, useState } from "react";

import useAccount from "_hooks/useAccount";
import { Button, Result, Tabs } from "antd";

/** components */
import Header from "./components/Header";

/** styles */
import "./Profile.less";
import Info from "./components/Info";
import Score from "./components/Score";
import Avatar from "./components/Avatar";
import Security from "./components/Security";
import { ResultProps, ResultType } from "antd/lib/result";

const { TabPane } = Tabs;

const Profile: FunctionComponent = (props) => {
  const { account, fetchAccount } = useAccount();
  const [res, setRes] = useState<ResultProps & { show: boolean }>({ show: false });

  useEffect(() => {
    fetchAccount()
      .then(() => console.log("successed fetch user info"))
      .catch((err) => console.error(err));
  }, []);

  const { show, ...config } = res;

  const onResult = (info: { title: string; status: "success" | "error" }): void => {
    setRes({
      show: true,
      title: info.title,
      status: info.status,
      extra: (
        <Button
          type="primary"
          onClick={(): void => setRes(Object.assign({}, res, { show: false }))}
        >
          返回
        </Button>
      ),
    });
  };

  /* render */
  return (
    <section className="profile">
      <Header></Header>
      {show ? (
        <Result {...config}></Result>
      ) : (
        <div className="profile-content">
          <Tabs defaultActiveKey="info" tabPosition="left">
            <TabPane key="info" tab="个人信息">
              <Info
                onSuccessed={(): void =>
                  onResult({ title: "更新个人信息成功！", status: "success" })
                }
                onFailed={(): void => onResult({ title: "更新个人信息失败！", status: "error" })}
              ></Info>
            </TabPane>
            <TabPane key="security" tab="安全">
              <Security value={account.cell_phone}></Security>
            </TabPane>
            <TabPane key="avatar" tab="头像">
              <Avatar
                onSuccessed={(): void => onResult({ title: "更新头像成功！", status: "success" })}
                onFailed={(): void => onResult({ title: "更新头像失败！", status: "error" })}
              ></Avatar>
            </TabPane>
            <TabPane key="score" tab="积分">
              <Score></Score>
            </TabPane>
          </Tabs>
        </div>
      )}
    </section>
  );
};

export default Profile;
