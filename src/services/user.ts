import axios from "./api";
import { UserI } from "_constants/interface";

export const weChatLoginUser = async (params: any) => {
  // console.log(params);
  const res = await axios.post(`/user/wechat-oauth2-login/`, params);
  return res;
};

export const loginUser = async (params: any) => {
  const res = await axios.post(`/auth/login/`, params);
  return res;
};

export const getUserInfo = async () => {
  const res = await axios.get(`/user/user-info/`);
  return res;
};

// export const updateUserInfo = async (params: UserFormI): Promise<UserI> => {
export const updateUserInfo = async (params: any) => {
  const res = await axios.post(`/user/update/`, params);
  return res;
};

export const logoutUser = async () => {
  const res = await axios.post(`/auth/logout/`);
  return res;
};

export const sendIdentifyingCode = async (params: any) => {
  const res = await axios.post(`/user/send-sms/`, params);
  return res;
};

export const getPrivacyNotice = async () => {
  const res = await axios.get(`/user/privacy-notice/`);
  return res;
};

export const agreePrivacyNotice = async (params: any) => {
  const res = await axios.post(`/user/privacy-notice/agree/`, params);
  return res;
};
