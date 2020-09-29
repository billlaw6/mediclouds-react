import React, { Component, ReactElement, ReactNode } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { RoutesI } from "_types/router";
import routes from "./routes";

import DefaultLayout from "_layout/Default/Default";
// import RouteWithSubRoutes from "_components/RouteWithSubRoutes";

/* pages */
import Error from "_pages/error/Error";
import AuthorizedRoute from "_components/AuthorizedRoute";

import "./App.less";

const getRouters = (routers: RoutesI[], parentPath = ""): ReactNode => {
  return routers.map((item, index) => {
    const { component, layout, name, routes, path, ...args } = item;
    const Layout = layout;
    const Cmp = component;

    return (
      <AuthorizedRoute
        key={index}
        path={`${parentPath}${path}`}
        {...args}
        render={(props): ReactNode => {
          if (routes) return <>{getRouters(routes, path)}</>;

          return Layout ? (
            <Layout>
              <Cmp {...props}></Cmp>
            </Layout>
          ) : (
            <Cmp {...props}></Cmp>
          );
        }}
      ></AuthorizedRoute>
    );
  });
};

class App extends Component {
  render(): ReactElement {
    const routers = getRouters(routes);

    return (
      // {/* 原本用官方推荐的BrowserRouter，结果只变url不刷新页面
      //               https://github.com/brickspert/blog/issues/3 */}
      <Router>
        <Switch>
          {routers}
          <Route
            render={(): ReactElement => {
              return (
                <DefaultLayout>
                  <Error></Error>
                </DefaultLayout>
              );
            }}
          ></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
