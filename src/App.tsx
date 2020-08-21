import React, { Component, ReactElement } from "react";
import { Router, Switch, Route } from "react-router-dom";
import routes from "./routes";
import { history } from "./store/configureStore";

import DefaultLayout from "_layout/Default/Default";
// import RouteWithSubRoutes from "_components/RouteWithSubRoutes";

/* pages */
import Error from "_pages/error/Error";

import "./App.less";
import AuthorizedRoute from "_components/AuthorizedRoute";

class App extends Component {
  render(): ReactElement {
    return (
      // {/* 原本用官方推荐的BrowserRouter，结果只变url不刷新页面
      //               https://github.com/brickspert/blog/issues/3 */}
      <Router history={history}>
        <Switch>
          {routes.map((item, index) => {
            // return <RouteWithSubRoutes key={index} {...item} />;
            const { component, layout, name, ...args } = item;
            const Layout = layout;
            const Cmp = component;

            return (
              <AuthorizedRoute
                key={index}
                {...args}
                render={(props) => {
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
          })}
          <Route
            render={(): ReactElement => (
              <DefaultLayout>
                <Error></Error>
              </DefaultLayout>
            )}
          ></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
