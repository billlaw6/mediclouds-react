import React, { Component, ReactElement } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { StoreStateI, RouteI } from "_constants/interface";
import { history } from "../store/configureStore";
import { RoutesI } from "routes";
import DefaultLayout from "_layout/Default/Default";

class RouteWithSubRoutes extends Component<RoutesI & MapStateToPropsI> {
  // 二级路由路径需要非exact匹配？从路由配置里取值更灵活
  componentDidMount(): void {
    const { permission = [], token } = this.props;
    if (permission.length > 0) {
      if (token.length > 0) {
        console.log(token);
      } else {
        // console.log(token);
        // console.log(token.length);
        if (process.env.NODE_ENV !== "development") history.push({ pathname: "/login" });
      }
    }
    // 使用localStorage的值会有滞后，首次登录会校验错误
    // const persistRoot = JSON.parse(localStorage.getItem("persist:root")!);
    // // console.log(JSON.parse(persistRoot.token).length);
    // if (persistRoot && persistRoot.token && JSON.parse(persistRoot.token).length > 2) {
    //   console.log(JSON.parse(persistRoot.token));
    // } else {
    //   console.log(persistRoot);
    //   console.log(persistRoot.token);
    //   console.log(JSON.parse(persistRoot.token));
    //   console.log("redirect in route with sub route");
    // }
  }
  render(): ReactElement {
    const { path, exact = false, routes = [], component, layout = DefaultLayout } = this.props;
    const Cmp = component;
    const Layout = layout;

    return (
      <Route
        path={path}
        exact={exact}
        render={(props): ReactElement => {
          return (
            <Layout>
              <Cmp {...props}></Cmp>
            </Layout>
          );
        }}
      />
    );
  }
}

// export default RouteWithSubRoutes;
interface MapStateToPropsI {
  token: string;
}
const mapStateToProps = (state: StoreStateI): MapStateToPropsI => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(RouteWithSubRoutes);
