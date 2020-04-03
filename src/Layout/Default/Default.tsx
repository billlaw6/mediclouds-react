import React, { Component, ReactElement } from "react";
import { Layout } from "antd";
import { connect, MapDispatchToProps } from "react-redux";

/* components */
import Header from "_components/Header/Header";
import Footer from "_components/Footer/Footer";
import { StoreStateI } from "_constants/interface";

/* style */
import "./Default.less";

/* action */
import { logoutUserAction } from "_actions/user";
import { LOGOUT_USER } from "store/action-types";

const { Content } = Layout;

class DefalutLayout extends Component<StoreStateI & MapDispatchToPropsI> {
  render(): ReactElement {
    const { children, user, logout } = this.props;
    const { avatar, nickname, is_superuser: isSuperuser } = user;

    return (
      <Layout id="defaultLayout">
        <Header
          avatar={avatar}
          isSuperuser={isSuperuser}
          nickname={nickname}
          logout={logout}
        ></Header>
        <Content id="content">{children}</Content>
        <Footer></Footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state: StoreStateI): StoreStateI => state;
interface MapDispatchToPropsI {
  logout: typeof logoutUserAction;
}
const mapDispatchToProps: MapDispatchToPropsI = {
  logout: logoutUserAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(DefalutLayout);
