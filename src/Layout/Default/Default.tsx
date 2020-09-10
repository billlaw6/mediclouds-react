import React, { FunctionComponent } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";

/* components */
import Header from "_components/Header/Header";
import Footer from "_components/Footer/Footer";
import { StoreStateI } from "_types/core";

/* action */
import { logoutUserAction } from "_actions/user";
import SideBtns from "_components/SideBtns";
import { CustomerI, RoleE } from "_types/account";

/* style */
import "./Default.less";

const { Content } = Layout;

const DefalutLayout: FunctionComponent = (props) => {
  const { children } = props;

  const user = useSelector<StoreStateI, CustomerI>((state) => state.user);
  const { avatar, nickname, role } = user;

  return (
    <Layout id="defaultLayout">
      <Header
        avatar={avatar}
        isSuperuser={role === RoleE.SUPER_ADMIN}
        nickname={nickname}
        logout={logoutUserAction}
      ></Header>
      <Content id="content">{children}</Content>
      <Footer></Footer>
      <SideBtns></SideBtns>
    </Layout>
  );
};

export default DefalutLayout;
