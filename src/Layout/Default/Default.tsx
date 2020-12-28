import React, { FunctionComponent } from "react";
import { Layout } from "antd";

/* components */
import Header from "_components/Header/Header";
import Footer from "_components/Footer/Footer";

/* action */
import SideBtns from "_components/SideBtns";
import { RoleE } from "mc-api";

import useAccount from "_hooks/useAccount";
import { IS_MOBILE } from "_constants";

/* style */
import "./Default.less";

const { Content } = Layout;

const DefalutLayout: FunctionComponent = (props) => {
  const { children } = props;
  const { logoutPersonal } = useAccount();

  const { account } = useAccount();

  const { avatar, nickname, role } = account;

  return (
    <Layout id="defaultLayout" className={`${IS_MOBILE ? "mobile" : ""}`}>
      <Header
        avatar={avatar}
        isSuperuser={role === RoleE.SUPER_ADMIN}
        nickname={nickname}
        logout={logoutPersonal}
      ></Header>
      <Content id="content">{children}</Content>
      <Footer></Footer>
      {IS_MOBILE ? null : <SideBtns></SideBtns>}
    </Layout>
  );
};

export default DefalutLayout;
