import { personalApi } from "./index";
import { UserI } from "_types/api";
import { ApiFuncI } from "_types/api";

export const wechatLogin: ApiFuncI = async (params: any) =>
  await personalApi.post(`/user/wechat-oauth2-login/`, params);

export const loginUser = async (params: any) => {
  const res = await personalApi.post(`/auth/login/`, params);
  return res;
};

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
