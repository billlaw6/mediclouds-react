import { personalReq, publicReq } from "./index";
import { AccountI, StatsI } from "_types/account";
import { CreateAccountDataI } from "_types/account";
import {
  ApiFuncI,
  GetSearchQueryPropsI,
  CaptchaI,
  PhoneLoginDataI,
  SendSmsDataI,
  FormLoginDataI,
  SearchQueryResI,
} from "_types/api";

export const wechatLogin: ApiFuncI = async (params: any) =>
  await personalReq({ method: "POST", url: "/user/wechat-oauth2-login/" }, params);

export const loginUser = async (params: any): Promise<{ key: string }> =>
  await personalReq({ method: "POST", params });

/* 用户表单登录 */
export const loginForm: ApiFuncI = async (data: FormLoginDataI) =>
  await publicReq(
    {
      method: "POST",
      url: "/user/login-form/",
      data,
    },
    false,
  );

/* 用户手机号登录 */
export const loginPhone: ApiFuncI = async (data: PhoneLoginDataI) =>
  await publicReq(
    {
      method: "POST",
      url: "/user/login-phone/",
      data,
    },
    false,
  );

/* 获取用户列表 */
export const getUserList: ApiFuncI = async () =>
  await personalReq({ method: "GET", url: "/user/list/" });

export const deleteUsers = async (data: any) =>
  await personalReq({ method: "POST", url: "/user/delete/", data });

export const deactivateUsers = async (data: any) =>
  await personalReq({ method: "POST", url: "/user/deactivate/", data });

export const activateUsers = async (data: any) =>
  await personalReq({ method: "POST", url: "/user/activate/", data });

export const getUserInfo = async () =>
  await personalReq({ method: "GET", url: "/user/user-info/" });

export const updateUserInfo = async (data: any) =>
  await personalReq({ method: "POST", url: "/user/update/", data });

export const logoutUser = async () =>
  await personalReq({ method: "POST", url: "/auth/logout/" }, false);

export const sendIdentifyingCode = async (data: any) =>
  await personalReq({
    method: "POST",
    url: "/user/send-sms/",
    data,
  });

export const getPrivacyNotice = async () =>
  await personalReq({ method: "GET", url: "/user/privacy-notice/" }, false);

export const agreePrivacyNotice = async (data: any) =>
  await personalReq({ method: "POST", url: "/user/privacy-notice/agree/", data });

export const updatePrivacyNotice = async (data: { id?: number; content: string }): Promise<any> =>
  await personalReq({ method: "POST", url: "/user/privacy-notice/", data });

export const getFeedbackType = async () =>
  await personalReq({ method: "GET", url: "/user/feedback-type/" });

export const getFeedback = async (params: any) =>
  await personalReq({ method: "GET", url: `/user/feedback/`, params });

export const createFeedback = async (params: any) =>
  await personalReq({ method: "POST", url: "/user/feedback/" }, params);

export const getUserStats = async (params?: any) =>
  await personalReq({ method: "GET", url: "/user/user-stats/", params });

/* 获得下属账户列表 */
export const getAffiliatedList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<AccountI>> =>
  await publicReq({
    method: "GET",
    url: `/user/affiliated-list/${id}/`,
    params: searchQuery,
  });

/* 获得下属用户列表 */
export const getCustomerList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<SearchQueryResI<AccountI>> =>
  await publicReq({
    method: "GET",
    url: `/user/customer-list/${id}/`,
    params: searchQuery,
  });

/* 创建新账户 */
export const createAccount = async (data: CreateAccountDataI): Promise<AccountI> =>
  await publicReq({
    method: "POST",
    url: "/user/create/",
    data,
  });

/* 获取统计信息 */
export const getStats = async (id: string): Promise<StatsI> =>
  await publicReq({
    method: "GET",
    url: `/stats/${id}`,
  });

/* 更新账户信息 */
export const updateAccount = async (id: string, data: FormData): Promise<AccountI> =>
  await publicReq({
    method: "POST",
    url: `/user/update/${id}/`,
    data,
  });

/* 获取captcha验证码 */
export const getCaptcha = async (): Promise<CaptchaI> =>
  await publicReq(
    {
      method: "GET",
      url: "/captcha/",
    },
    false,
  );

/* 删除账户 */
export const delAccount = async (id: string[]): Promise<string[]> =>
  await publicReq({
    method: "POST",
    url: "/user/del/",
    data: { id },
  });

/* 获取账单 */
export const getBilling = async (): Promise<any> =>
  await publicReq({
    method: "GET",
    url: "/user/billing/",
  });

/* 获取账户信息 */
export const getAccountInfo = async (id: string): Promise<AccountI> =>
  await publicReq({
    method: "GET",
    url: `/user/info/${id}`,
  });

/* 获取短信验证码 */
export const getSmsCode = async (data: SendSmsDataI): Promise<CaptchaI> =>
  await publicReq(
    {
      method: "POST",
      url: "/send-sms/",
      data,
    },
    false,
  );

/* 退出登录状态 */
export const logout = async (): Promise<void> =>
  await publicReq(
    {
      method: "POST",
      url: "/user/logout/",
    },
    false,
  );

export default {
  loginForm,
  loginPhone,
  loginWechat: wechatLogin,
  getAffiliatedList,
  getCustomerList,
  createAccount,
  updateAccount,
  getCaptcha,
  getSmsCode,
  getStats,
  logout,
};
