import React, { FunctionComponent } from "react";
import { Route, RouteProps, Redirect, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RoleE, UserI, AccountStatusE } from "_types/account";
import { StoreStateI } from "_types/core";
import { PermissionT } from "_types/router";
import useUrlQuery from "_hooks/useUrlQuery";
import { clearSessionStorage, setSessionStorage } from "_helper";

interface AuthorizedRoutePropsI extends RouteProps {
  permission?: PermissionT;
}

const hasPermission = (key: RoleE | AccountStatusE, permission: PermissionT): boolean =>
  !!(permission.indexOf(key) > -1);

const AuthorizedRoute: FunctionComponent<AuthorizedRoutePropsI> = (props) => {
  // const customer = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.user);
  /** 当url内含有 s=1 时 如果没有权限 则在sessionStore内记录此url 并跳转到登录页面 */
  const location = useLocation();
  const { pathname, search } = location;
  const { s } = useUrlQuery<{ [key: string]: any; s?: 1 }>();
  const account = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.account);

  const { permission = [], children, ...args } = props;

  const goLogin =
    hasPermission(AccountStatusE.DISABLED, permission) ||
    (hasPermission(AccountStatusE.LOGIN, permission) && !account.login) ||
    (account.login && permission.length && !hasPermission(account.role, permission));

  if (s) {
    setSessionStorage("s", JSON.stringify({ nav: pathname, search }));
  } else {
    if (pathname !== "/login") clearSessionStorage("s");
  }

  if (goLogin) return <Redirect to="/login"></Redirect>;
  // if (hasPermission(AccountStatusE.DISABLED, permission))
  //   return <Redirect to={loginUrl}></Redirect>;
  // if (hasPermission(AccountStatusE.LOGIN, permission)) {
  //   if (!account.login) return <Redirect to={loginUrl}></Redirect>;
  // }

  // if (account.login) {
  //   const { role } = account;

  //   if (permission.length && !hasPermission(role, permission)) {
  //     return <Redirect to={loginUrl}></Redirect>;
  //   }
  // }

  // if (customer.login) {
  //   const { role } = customer;

  //   if (permission.length && !hasPermission(role, permission)) {
  //     return <Redirect to="/login"></Redirect>;
  //   }
  // }

  return <Route {...args}>{children}</Route>;
};

export default AuthorizedRoute;
