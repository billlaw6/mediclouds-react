import { personalApi, publicAPi } from "./index";
import { ApiFuncI, AccountI } from "_types/api";
import { CreateAccountDataI } from "_types/account";

export const wechatLogin: ApiFuncI = async (params: any) =>
  await personalApi.post(`/user/wechat-oauth2-login/`, params);

export const loginUser = async (params: any) => {
  const res = await personalApi.post(`/auth/login/`, params);
  return res;
};

/* 用户表单登录 */
export const loginForm: ApiFuncI = async () => await publicAPi.post("/user/login-form");
/* 用户手机号登录 */
export const loginPhone: ApiFuncI = async () => await publicAPi.post("/user/login-phone");

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

// export const updateUserInfo = async (params: UserFormI): Promise<UserI> => {
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
export const getAffiliatedList = async (): Promise<AccountI[]> =>
  await publicAPi.get("/user/affiliated-list");

/* 获得下属用户列表 */
export const getCustomerList = async (): Promise<AccountI[]> =>
  await publicAPi.get("/user/customer-list");

/* 创建新账户 */
export const createAccount = async (data: CreateAccountDataI): Promise<AccountI> =>
  await publicAPi.post("/user/create", data);

export default {
  loginForm,
  loginPhone,
  loginWechat: wechatLogin,
  getAffiliatedList,
  getCustomerList,
  createAccount,
};
