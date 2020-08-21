/* 路由相关 */

import { AccountTypeE, CustomerTypeE, AccountStatusE } from "./api";
import { ComponentType } from "react";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";
import DefaultLayout from "_layout/Default/Default";

/* 路由权限 */
export type PermissionT = (AccountTypeE | CustomerTypeE | AccountStatusE)[];

/* 路由 */
export interface RoutesI {
  name: string;
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  routes?: RoutesI[];
  permission?: PermissionT;
  layout?: typeof DefaultLayout | typeof FullscreenLayout; // 布局
}
