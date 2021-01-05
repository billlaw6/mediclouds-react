import React, { FunctionComponent } from "react";
import { Route, RouteProps, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RoleE, UserI, UserStatusE } from "mc-api";
// import { AccountStatusE } from "_types/account";
import { StoreStateI } from "_types/core";
import { PermissionT } from "_types/router";
import useUrlQuery from "_hooks/useUrlQuery";
import { clearLocalStorage, setLocalStorage } from "_helper";

interface AuthorizedRoutePropsI extends RouteProps {
  permission?: PermissionT;
}

const hasPermission = (key: RoleE | UserStatusE, permission: PermissionT): boolean =>
  !!(permission.indexOf(key) > -1);

const AuthorizedRoute: FunctionComponent<AuthorizedRoutePropsI> = (props) => {
  // const customer = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.user);
  /** 当url内含有 s=1 时 如果没有权限 则在sessionStore内记录此url 并跳转到登录页面 */
  const location = useLocation();
  const { pathname, search } = location;
  const { s } = useUrlQuery<{ [key: string]: any; s?: 1 }>();
  const account = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.account);

  const { permission = [], children, ...args } = props;

  const permissionDenied =
    hasPermission(UserStatusE.DISABLED, permission) ||
    (hasPermission(UserStatusE.LOGIN, permission) && !account.login) ||
    (account.login && permission.length && !hasPermission(account.role, permission));

  if (s) {
    setLocalStorage("s", JSON.stringify({ nav: pathname, search }));
  } else {
    if (pathname !== "/login" && pathname !== "/oauth") clearLocalStorage("s");
  }

  if (permissionDenied) {
    // 如果因没有权限导致跳转登录页，则记录s 当登录后跳转回之前的页面
    setLocalStorage("s", JSON.stringify({ nav: pathname, search }));
    return <Redirect to="/login"></Redirect>;
  }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
