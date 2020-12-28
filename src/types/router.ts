/* 路由相关 */

import { ComponentType } from "react";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";
import DefaultLayout from "_layout/Default/Default";
import { RoleE, UserStatusE } from "mc-api";

/* 路由权限 */
export type PermissionT = (RoleE | UserStatusE)[];

/* 路由 */
export interface RoutesI {
  name: string;
  path: string;
  component?: ComponentType<any>;
  exact?: boolean;
  routes?: RoutesI[];
  permission?: PermissionT;
  layout?: typeof DefaultLayout | typeof FullscreenLayout; // 布局
}
