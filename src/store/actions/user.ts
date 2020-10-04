import { UserI } from "_types/account";
import { ActionI } from "_types/core";
import * as types from "../action-types";

// 设置后台给的token
export type SetTokenActionT = ActionI<string, string>;
export interface SetTokenActionFuncI {
  (payload: string): SetTokenActionT;
}
export const setTokenAction: SetTokenActionFuncI = (payload) => ({
  type: types.SET_TOKEN,
  payload,
});

// 设置登录用户全局变量
export type SetUserActionT = ActionI<string, UserI>;
export interface SetUserActionFuncT {
  (payload: UserI): SetUserActionT;
}
export const setUserAction: SetUserActionFuncT = (payload) => ({
  type: types.SET_USER,
  payload,
});

// 需要监听：用于用户信息更新
export type UpdateUserActionT = ActionI<string, FormData>;
export interface UpdateUserActionFuncT {
  (payload: FormData): UpdateUserActionT;
}
export const updateUserAction: UpdateUserActionFuncT = (payload) => ({
  type: types.UPDATE_USER,
  payload,
});

// 用户注销时操作：发起远程注销，清楚本地变量
export type LogoutUserActionT = ActionI<string, void>;
export interface LogoutUserActionFuncT {
  (payload: void): LogoutUserActionT;
}
export const logoutUserAction: LogoutUserActionFuncT = (payload) => ({
  type: types.LOGOUT_USER,
  payload,
});

// export type SubmitLoginFormActionT = ActionI<string, LoginFormI>;
// export interface SubmitLoginFormActionFuncT {
//   (payload: LoginFormI): SubmitLoginFormActionT;
// }
// export const submitLoginFormAction: SubmitLoginFormActionFuncT = payload => ({
//   type: types.SUBMIT_LOGIN_FORM,
//   payload,
// });

// export type SetUserInfoActionT = ActionI<string, UserI>;
// export interface SetUserInfoActionFuncT {
//   (payload: UserI): SetUserInfoActionT;
// }
// export const setUserInfoAction: SetUserInfoActionFuncT = payload => ({
//   type: types.SET_USER_INFO,
//   payload,
// });

// export type SetUserListActionT = ActionI<string, UserI[]>;
// export interface SetUserListActionFuncT {
//   (payload: UserI[]): SetUserListActionT;
// }
// export const setUserListAction: SetUserListActionFuncT = payload => ({
//   type: types.SET_USER_LIST,
//   payload,
// });

// export type UpdateUserInfoActionT = ActionI<string, UserI>;
// export interface UpdateUserInfoActionFuncT {
//   (payload: UserI): UpdateUserInfoActionT;
// }
// export const updateUserInfoAction: UpdateUserInfoActionFuncT = payload => ({
//   type: types.UPDATE_USER_INFO,
//   payload,
// });

// export type AgreePrivacyNoticeT = ActionI<string, { privacy_notice_id: number }>;
// export interface AgreePrivacyNoticeActionFuncT {
//   (payload: { privacy_notice_id: number }): AgreePrivacyNoticeT;
// }
// export const agreePrivacyNoticeAction: AgreePrivacyNoticeActionFuncT = payload => ({
//   type: types.AGREE_PRIVACY_NOTICE,
//   payload,
// });

// export type SetWeChatCodeActionT = ActionI<string, string>;
// export interface SetWeChatCodeActionFuncI {
//   (payload: string): SetWeChatCodeActionT;
// }
// export const setWeChatCodeAction: SetWeChatCodeActionFuncI = payload => ({
//   type: types.SET_WECHAT_CODE,
//   payload,
// });
