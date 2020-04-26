import React, { ReactElement } from "react";
import { withRouter } from "react-router-dom";
// import storage from "utils/storage.ts";

function withHocPrivateRoute(WrappedComponent: React.Component, hocProps: any): void {
  if (!WrappedComponent) {
    throw new Error("Component paramater required!");
  }

  // return withRouter(
  //   class HocPrivateRoute extends React.Component<any, any> {
  //     componentWillMount(): void {
  //       const isAuthenticated = localStorage.getItem("") ? true : false;
  //       if (!isAuthenticated) {
  //         this.props.history.replace("/login");
  //       }
  //     }
  //     render() {
  //       return this.state.isAuthenticated ? <WrappedComponent {...hocProps} /> : "请重新登录";
  //     }
  //   },
  // );
}

export default withHocPrivateRoute;
