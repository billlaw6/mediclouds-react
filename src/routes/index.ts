/* layouts */
import DefaultLayout from "_layout/Default/Default";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";

/* Pages */
import Resources from "_pages/resources/index";
import Player from "_pages/player/index";
import Login from "_pages/login";
import LoginForm from "_pages/login_form/Login";
import Upload from "_pages/upload/Upload";
import Profile from "_pages/profile/Profile";
import UserManage from "_pages/users/UserManage";
import Feedback from "_pages/feedback/Feedback";
import Dashboard from "_pages/dashboard/Dashboard";
import MdEditor from "_pages/mdEditor/MdEditor";
import MobileUpload from "_pages/mobileUpload/MobileUpload";
import Oauth from "_pages/oauth/Oauth";
import Gallery from "_pages/gallery/Gallery";
import LoginAffiliate from "_pages/login_affiliate/LoginAffiliate";
import OauthAffilate from "_pages/oauth/OauthAffilate";
import HomeResource from "_pages/homeResource/HomeResource";
import Home from "_pages/home";
import { RoutesI } from "_types/router";
import { AccountStatusE, RoleE } from "_types/account";
import Manager from "_pages/manager";
import ManagerLayout from "_layout/Manager";
import AccountRole from "_components/AccountRole";

const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

const routes: RoutesI[] = [
  {
    name: "home",
    path: "/",
    exact: true,
    component: Home,
    layout: FullscreenLayout,
  },
  {
    name: "resources",
    path: "/resources",
    component: Resources,
    layout: DefaultLayout,
    permission: [AccountStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.EMPLOYEE, RoleE.DOCTOR],
  },
  // {
  //   name: "login_form",
  //   path: "/login_form",
  //   component: LoginForm,
  // },
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
    layout: IS_MOBILE ? FullscreenLayout : DefaultLayout,
    permission: [AccountStatusE.LOGIN],
  },
  {
    name: "upload",
    path: "/upload",
    component: Upload,
    layout: DefaultLayout,
    // permission: [AccountStatusE.LOGIN],
  },
  {
    name: "oauth",
    path: "/oauth",
    component: Oauth,
  },
  {
    name: "oauthAffiliate",
    path: "/oauth-affiliate",
    component: OauthAffilate,
  },
  {
    name: "profile",
    path: "/profile",
    component: Profile,
    layout: DefaultLayout,
    permission: [AccountStatusE.LOGIN],
  },
  {
    name: "feedback",
    path: "/feedback",
    component: Feedback,
    layout: DefaultLayout,
    permission: [AccountStatusE.LOGIN],
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: Dashboard,
    layout: FullscreenLayout,
    permission: [AccountStatusE.LOGIN, RoleE.SUPER_ADMIN],
  },
  {
    name: "manager",
    path: "/manager/:name?",
    component: Manager,
    layout: ManagerLayout,
    permission: [
      AccountStatusE.LOGIN,
      RoleE.SUPER_ADMIN,
      RoleE.BUSINESS,
      RoleE.MANAGER,
      RoleE.EMPLOYEE,
    ],
  },
  {
    name: "user_manage",
    path: "/users",
    component: UserManage,
    permission: [AccountStatusE.LOGIN, RoleE.SUPER_ADMIN],
  },
  // {
  //   name: "homeRes",
  //   path: "/home-res",
  //   component: HomeResource,
  //   layout: DefaultLayout,
  //   permission: [AccountStatusE.LOGIN, RoleE.SUPER_ADMIN],
  // },
  // {
  //   name: "mdEditor",
  //   path: "/mdeditor",
  //   component: MdEditor,
  //   permission: [AccountStatusE.LOGIN, RoleE.SUPER_ADMIN],
  //   layout: FullscreenLayout,
  // },
  // {
  //   name: "gallery",
  //   path: "/gallery",
  //   component: Gallery,
  //   permission: [AccountStatusE.LOGIN],
  //   layout: FullscreenLayout,
  // },
  {
    name: "mobileUpload",
    path: "/mu",
    component: MobileUpload,
    permission: [AccountStatusE.LOGIN],
  },
  {
    name: "loginAffiliate",
    path: "/login-affiliate",
    component: LoginAffiliate,
    layout: FullscreenLayout,
  },
];

export default routes;
