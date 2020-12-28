/* layouts */
import DefaultLayout from "_layout/Default/Default";
import FullscreenLayout from "_layout/FullscreenLayout/FullscreenLayout";

/* Pages */
import Resources from "_pages/resources/index";
import Player from "_pages/player/index";
import Login from "_pages/login";
// import LoginForm from "_pages/login_form/Login";
import Upload from "_pages/upload/Upload";
import Profile from "_pages/profile/Profile";
import Feedback from "_pages/feedback/Feedback";
import MobileUpload from "_pages/mobileUpload/MobileUpload";
import Oauth from "_pages/oauth/Oauth";
import LoginAffiliate from "_pages/login_affiliate/LoginAffiliate";
// import OauthAffilate from "_pages/oauth/OauthAffilate";
import Home from "_pages/home";
import { RoutesI } from "_types/router";
import { RoleE, UserStatusE } from "mc-api";
import Manager from "_pages/manager";
import ManagerLayout from "_layout/Manager";
import Register from "_pages/register";
import Pay from "_pages/pay/index";
import PublicCT from "_pages/publicCT";
import ErrMsg from "_pages/errMsg";
import { IS_MOBILE } from "_constants";
import CaseList from "_pages/caseList";
import Case from "_pages/case";
// import AILayout from "_layout/AI";

const routes: RoutesI[] = [
  {
    name: "home",
    path: "/",
    exact: true,
    component: Resources,
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.DOCTOR, RoleE.PATIENT],
    // component: Home,
    // layout: FullscreenLayout,
  },
  {
    name: "resources",
    path: "/resources",
    component: Resources,
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.DOCTOR, RoleE.PATIENT],
  },
  {
    name: "caseList",
    path: "/case",
    component: CaseList,
    layout: DefaultLayout,
    exact: true,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.DOCTOR, RoleE.PATIENT],
  },
  {
    name: "case",
    path: "/case/:id",
    component: Case,
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.DOCTOR, RoleE.PATIENT],
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
    layout: FullscreenLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.PATIENT, RoleE.DOCTOR],
  },
  {
    name: "upload",
    path: "/upload",
    component: Upload,
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.PATIENT, RoleE.DOCTOR],
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
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.PATIENT, RoleE.DOCTOR],
  },
  {
    name: "feedback",
    path: "/feedback",
    component: Feedback,
    layout: DefaultLayout,
    permission: [UserStatusE.LOGIN, RoleE.SUPER_ADMIN, RoleE.PATIENT, RoleE.DOCTOR],
  },
  {
    name: "manager",
    path: "/manager/:name?",
    component: Manager,
    layout: ManagerLayout,
    permission: [
      UserStatusE.LOGIN,
      RoleE.SUPER_ADMIN,
      RoleE.BUSINESS,
      RoleE.MANAGER,
      RoleE.EMPLOYEE,
    ],
  },
  {
    name: "mobileUpload",
    path: "/mu",
    component: MobileUpload,
    permission: [UserStatusE.LOGIN],
  },
  {
    name: "loginAffiliate",
    path: "/login-affiliate",
    component: LoginAffiliate,
    layout: FullscreenLayout,
  },
  {
    name: "register",
    path: "/register",
    component: Register,
  },
  { name: "pay", path: "/pay", component: Pay },
  { name: "public-ct", path: "/public-ct", component: PublicCT, layout: DefaultLayout },
  { name: "err-msg", path: "/e", component: ErrMsg, layout: FullscreenLayout },
];

export default routes;
