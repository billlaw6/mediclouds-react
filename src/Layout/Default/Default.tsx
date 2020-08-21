import React, { FunctionComponent } from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";

/* components */
import Header from "_components/Header/Header";
import Footer from "_components/Footer/Footer";
import { StoreStateI } from "_types/core";

/* style */
import "./Default.less";

/* action */
import { logoutUserAction } from "_actions/user";
import SideBtns from "_components/SideBtns";
import { UserI } from "_types/api";

const { Content } = Layout;

const DefalutLayout: FunctionComponent = (props) => {
  const { children } = props;

  const user = useSelector<StoreStateI, UserI>((state) => state.user);
  const { avatar, nickname, is_superuser: isSuperuser } = user;

  return (
    <Layout id="defaultLayout">
      <Header
        avatar={avatar}
        isSuperuser={isSuperuser}
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

// class DefalutLayout extends Component<StoreStateI & MapDispatchToPropsI> {
//   render(): ReactElement {
//     const { children, user, logout } = this.props;
//     const { avatar, nickname, is_superuser: isSuperuser } = user;

//     return (
//       <Layout id="defaultLayout">
//         <Header
//           avatar={avatar}
//           isSuperuser={isSuperuser}
//           nickname={nickname}
//           logout={logout}
//         ></Header>
//         <Content id="content">{children}</Content>
//         <Footer></Footer>
//         <SideBtns></SideBtns>
//       </Layout>
//     );
//   }
// }

// const mapStateToProps = (state: StoreStateI): StoreStateI => state;
// interface MapDispatchToPropsI {
//   logout: typeof logoutUserAction;
// }
// const mapDispatchToProps: MapDispatchToPropsI = {
//   logout: logoutUserAction,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(DefalutLayout);
