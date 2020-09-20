import React, { FunctionComponent } from "react";
import { Layout } from "antd";

/* components */
import Header from "_components/Header/Header";
import Footer from "_components/Footer/Footer";

/* action */
import SideBtns from "_components/SideBtns";
import { RoleE } from "_types/account";

import useAccount from "_hooks/useAccount";

/* style */
import "./Default.less";

const { Content } = Layout;

const DefalutLayout: FunctionComponent = (props) => {
  const { children } = props;
  const { logoutPersonal } = useAccount();

  // const user = useSelector<StoreStateI, CustomerI>((state) => state.user);
  const { user } = useAccount();

  const { avatar, nickname, role } = user;

  return (
    <Layout id="defaultLayout">
      <Header
        avatar={avatar}
        isSuperuser={role === RoleE.SUPER_ADMIN}
        nickname={nickname}
        logout={logoutPersonal}
      ></Header>
      <Content id="content">{children}</Content>
      <Footer></Footer>
      <SideBtns></SideBtns>
    </Layout>
  );
};

export default DefalutLayout;
