import { ComponentType } from "react";

import Home from "_pages/home/index";
import Player from "_pages/player/Player";
import Login from "_pages/login/Login";
import LoginForm from "_pages/login_form/Login";
import Upload from "_pages/upload/Upload";
import Profile from "_pages/profile/Profile";
import UserManage from "_pages/users/UserManage";
import Feedback from "_pages/feedback/Feedback";
import Dashboard from "_pages/dashboard/Dashboard";
import MdEditor from "_pages/mdEditor/MdEditor";

import DefaultLayout from "_layout/Default/Default";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";

import Oauth from "../pages/oauth/Oauth";

export interface RoutesI {
  name: string;
  path: string;
  component: ComponentType<any>;
  exact?: boolean;
  routes?: RoutesI[];
  permission?: string[];
  layout?: typeof DefaultLayout | typeof FullscreenLayout; // 布局
}

const routes: RoutesI[] = [
  {
    name: "home",
    path: "/",
    exact: true,
    component: Home,
    permission: ["login"],
  },
  {
    name: "login_form",
    path: "/login_form",
    component: LoginForm,
  },
  {
    name: "login",
    path: "/login",
    component: Login,
    layout: FullscreenLayout,
  },
  {
    name: "player",
    path: "/player",
    component: Player,
    permission: ["login"],
  },
  {
    name: "upload",
    path: "/upload",
    component: Upload,
    permission: ["login"],
  },
  {
    name: "oauth",
    path: "/oauth",
    component: Oauth,
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    permission: ["login"],
  },
  {
    name: "feedback",
    path: "/feedback",
    component: Feedback,
    permission: ["login"],
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    permission: ["login", "is_superuser"],
  },
  {
    name: "user_manage",
    path: "/users",
    component: UserManage,
    permission: ["login", "is_superuser"],
  },
  {
    name: "mdEditor",
    path: "/mdeditor",
    component: MdEditor,
    permission: ["login"],
    layout: FullscreenLayout,
  },
];

export default routes;
