import React, { FunctionComponent } from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import { AccountTypeE, AccountStatusE, UserI, CustomerTypeE } from "_types/api";
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
  const history = useHistory();

  const { permission = [], children, ...args } = props;

  if (hasPermission(AccountStatusE.DISABLED, permission)) return <Redirect to="/login"></Redirect>;
  if (hasPermission(AccountStatusE.LOGIN, permission)) {
    if (!user.unionid) return <Redirect to="/login"></Redirect>;
  }
  if (hasPermission(AccountTypeE.SUPER_ADMIN, permission)) {
    if (!user.is_superuser) history.goBack();
  }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
