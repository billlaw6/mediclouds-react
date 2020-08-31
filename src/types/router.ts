/* 路由相关 */

import { ComponentType } from "react";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";
import DefaultLayout from "_layout/Default/Default";
import { RoleE, AccountStatusE } from "./account";

/* 路由权限 */
export type PermissionT = (RoleE | AccountStatusE)[];

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
