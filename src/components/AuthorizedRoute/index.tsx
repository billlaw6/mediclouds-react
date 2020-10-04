import React, { FunctionComponent } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RoleE, UserI, AccountStatusE } from "_types/account";
import { StoreStateI } from "_types/core";
import { PermissionT } from "_types/router";

interface AuthorizedRoutePropsI extends RouteProps {
  permission?: PermissionT;
}

const hasPermission = (key: RoleE | AccountStatusE, permission: PermissionT): boolean =>
  !!(permission.indexOf(key) > -1);

const AuthorizedRoute: FunctionComponent<AuthorizedRoutePropsI> = (props) => {
  // const customer = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.user);
  const account = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.account);

  const { permission = [], children, ...args } = props;

  if (hasPermission(AccountStatusE.DISABLED, permission)) return <Redirect to="/login"></Redirect>;
  if (hasPermission(AccountStatusE.LOGIN, permission)) {
    if (!account.login) return <Redirect to="/login"></Redirect>;
  }

  if (account.login) {
    const { role } = account;

    if (permission.length && !hasPermission(role, permission)) {
      return <Redirect to="/login"></Redirect>;
    }
  }

  // if (customer.login) {
  //   const { role } = customer;

  //   if (permission.length && !hasPermission(role, permission)) {
  //     return <Redirect to="/login"></Redirect>;
  //   }
  // }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
