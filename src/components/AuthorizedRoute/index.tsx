import React, { FunctionComponent } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { AccountTypeE, AccountStatusE, UserI, CustomerTypeE, AccountI } from "_types/api";
import { StoreStateI } from "_types/core";
import { PermissionT } from "_types/router";

interface AuthorizedRoutePropsI extends RouteProps {
  permission?: PermissionT;
}

const hasPermission = (
  key: AccountTypeE | CustomerTypeE | AccountStatusE,
  permission: PermissionT,
): boolean => !!(permission.indexOf(key) > -1);

const AuthorizedRoute: FunctionComponent<AuthorizedRoutePropsI> = (props) => {
  const user = useSelector<StoreStateI, UserI>((state) => state.user);
  const account = useSelector<StoreStateI, AccountI & { login: boolean }>((state) => state.account);
  const history = useHistory();

  const { user_type } = account;
  const { permission = [], children, ...args } = props;

  if (hasPermission(AccountStatusE.DISABLED, permission)) return <Redirect to="/login"></Redirect>;
  if (hasPermission(AccountStatusE.LOGIN, permission)) {
    if (!account.login) return <Redirect to="/login"></Redirect>;
  }
  if (permission.length && !hasPermission(user_type, permission)) {
    history.goBack();
  }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
