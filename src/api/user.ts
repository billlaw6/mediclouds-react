import { personalApi, publicAPi } from "./index";
import { AccountFormLoginDataI, AccountI, StatsI, UpdateAccountDataI } from "_types/account";
import { CreateAccountDataI } from "_types/account";
import {
  ApiFuncI,
  GetSearchQueryPropsI,
  CaptchaI,
  PhoneLoginDataI,
  SendSmsDataI,
  FormLoginDataI,
} from "_types/api";
import { clearToken } from "_helper";

export const wechatLogin: ApiFuncI = async (params: any) =>
  await personalApi.post(`/user/wechat-oauth2-login/`, params);

/* 顾客表单登录 */
export const customerLoginForm: ApiFuncI = async () => personalApi.post("/user/login-form");

/* 开发表单登录 */
export const devFormLogin: ApiFuncI = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => await personalApi.post("/auth/login/", { username, password, remember: true });

export const loginUser = async (params: any): Promise<{ key: string }> => {
  const res = (await personalApi.post(`/auth/login/`, params)) as { key: string };
  return res;
};

/* 用户表单登录 */
export const loginForm: ApiFuncI = async (data: FormLoginDataI) =>
  await publicAPi.post("/user/login-form/", data);
/* 用户手机号登录 */
export const loginPhone: ApiFuncI = async (data: PhoneLoginDataI) =>
  await publicAPi.post("/user/login-phone/", data);

/* 获取用户列表 */
export const getUserList: ApiFuncI = async () => await personalApi.get(`/user/list/`);

export const deleteUsers = async (params: any) => {
  const res = await personalApi.post(`/user/delete/`, { params: params });
  return res;
};

export const deactivateUsers = async (params: any) => {
  const res = await personalApi.post(`/user/deactivate/`, { params: params });
  return res;
};

export const activateUsers = async (params: any) => {
  const res = await personalApi.post(`/user/activate/`, { params: params });
  return res;
};

export const getUserInfo = async () => {
  const res = await personalApi.get(`/user/user-info/`);
  return res;
};

// export const updateUserInfo = async (params: UserFormI): Promise<CustomerI> => {
export const updateUserInfo = async (params: any) => {
  const res = await personalApi.post(`/user/update/`, params);
  return res;
};

export const logoutUser = async () => {
  const res = await personalApi.post(`/auth/logout/`);
  return res;
};

export const sendIdentifyingCode = async (params: any) => {
  const res = await personalApi.post(`/user/send-sms/`, params);
  return res;
};

export const getPrivacyNotice = async () => {
  const res = await personalApi.get(`/user/privacy-notice/`);
  return res;
};

export const agreePrivacyNotice = async (params: any) => {
  const res = await personalApi.post(`/user/privacy-notice/agree/`, params);
  return res;
};

export const updatePrivacyNotice = async (data: { id?: number; content: string }): Promise<any> =>
  await personalApi.post("/user/privacy-notice/", data);

export const getFeedbackType = async () => {
  const res = await personalApi.get(`/user/feedback-type/`);
  return res;
};

export const getFeedback = async (params: any) => {
  const res = await personalApi.get(`/user/feedback/`, { params: params });
  return res;
};

export const createFeedback = async (params: any) => {
  const res = await personalApi.post(`/user/feedback/`, params);
  return res;
};

export const getUserStats = async (params?: any) => {
  const res = await personalApi.get(`/user/user-stats/`, { params: params });
  return res;
};

/* 获得下属账户列表 */
export const getAffiliatedList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<AccountI[]> =>
  await publicAPi.get(`/user/affiliated-list/${id}`, {
    params: searchQuery,
  });

/* 获得下属用户列表 */
export const getCustomerList = async (
  id: string,
  searchQuery?: GetSearchQueryPropsI,
): Promise<AccountI[]> =>
  await publicAPi.get(`/user/customer-list/${id}`, {
    params: searchQuery,
  });

/* 创建新账户 */
export const createAccount = async (data: CreateAccountDataI): Promise<AccountI> =>
  await publicAPi.post("/user/create/", data);

/* 获取统计信息 */
export const getStats = async (id: string): Promise<StatsI> => await publicAPi.get(`/stats/${id}`);

/* 更新账户信息 */
export const updateAccount = async (id: string, data: UpdateAccountDataI): Promise<AccountI> =>
  await publicAPi.post(`/user/update/${id}`, data);

/* 获取captcha验证码 */
export const getCaptcha = async (): Promise<CaptchaI> => {
  clearToken();

  return await publicAPi.get("/captcha/");
};

/* 删除账户 */
export const delAccount = async (id: string[]): Promise<string[]> =>
  await publicAPi.post("/user/del/", { id });

/* 获取账单 */
export const getBilling = async (): Promise<any> => await publicAPi.get("/user/billing/");

/* 获取账户信息 */
export const getAccountInfo = async (id: string): Promise<AccountI> =>
  await publicAPi.get(`/user/info/${id}`);

/* 获取短信验证码 */
export const getSmsCode = async (data: SendSmsDataI): Promise<CaptchaI> =>
  await publicAPi.post("/send-sms/", data);

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
};
