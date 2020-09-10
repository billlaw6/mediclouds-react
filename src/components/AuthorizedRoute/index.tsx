import React, { FunctionComponent, ReactNode } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { CustomerI } from "_types/account";
import { RoleE, AccountI, AccountStatusE } from "_types/account";
import { StoreStateI } from "_types/core";
import { PermissionT } from "_types/router";

interface AuthorizedRoutePropsI extends RouteProps {
  permission?: PermissionT;
}

const hasPermission = (key: RoleE | AccountStatusE, permission: PermissionT): boolean =>
  !!(permission.indexOf(key) > -1);

const AuthorizedRoute: FunctionComponent<AuthorizedRoutePropsI> = (props) => {
  const customer = useSelector<StoreStateI, CustomerI & { login: boolean }>((state) => state.user);
  const account = useSelector<StoreStateI, AccountI & { login: boolean }>((state) => state.account);
  const history = useHistory();

  const { role } = account;
  const { permission = [], children, ...args } = props;

  if (hasPermission(AccountStatusE.DISABLED, permission)) return <Redirect to="/login"></Redirect>;
  if (hasPermission(AccountStatusE.LOGIN, permission)) {
    if (!account.login && !customer.login) return <Redirect to="/login"></Redirect>;
  }
  if (permission.length && !hasPermission(role, permission)) {
    history.goBack();
  }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
