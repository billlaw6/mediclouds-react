import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { AccountActionTypes } from "_types/actions";
import { clearLocalStorage } from "_helper";
import { useHistory } from "react-router";
import moment from "moment";
import {
  UserI,
  UpdateUserDataI,
  wechatQrcodeLogin,
  loginForm,
  loginPhone,
  token,
  LoginFormDataI,
  LoginPhoneDataI,
  InviteRegisterDataI,
  getUserInfo,
  updateUserInfo,
  logout as mcLogout,
  InviteRegisterUser,
} from "mc-api";

import { store } from "../index";

const { setToken, clearToken } = token;

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.account);

  /* 微信二维码登录 */
  const wechatLogin = async (params: any): Promise<void> => {
    try {
      const loginRes = await wechatQrcodeLogin(params);
      clearLocalStorage();
      await store.persistor.purge();
      const { token, user_info } = loginRes;
      setToken(`Token ${token}`);
      dispatch({ type: AccountActionTypes.LOGIN_WECHAT, payload: user_info });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 表单登录 */
  const formLogin = async (data: LoginFormDataI, url = "/resources"): Promise<void> => {
    try {
      const loginRes = await loginForm(data);
      clearToken();
      const { token, user_info } = loginRes;

      if (token) {
        setToken(`Token ${token}`);
        dispatch({ type: AccountActionTypes.LOGIN_FORM, payload: user_info });
        history.replace(url);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 顾客手机号登录 */
  const personalPhoneLogin = async (data: LoginPhoneDataI, url = "/resources"): Promise<void> => {
    try {
      const loginRes = await loginPhone(data);
      clearToken();
      const { token, user_info } = loginRes;
      if (token) {
        setToken(token);
        dispatch({ type: AccountActionTypes.PERSONAL_LOGIN_PHONE, payload: user_info });
        history.replace(url);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 手机号登录 */
  const phoneLogin = async (data: LoginPhoneDataI, url = "/manager"): Promise<void> => {
    try {
      const loginRes = await loginPhone(data);
      clearToken();

      const { token, user_info } = loginRes;
      if (token) {
        setToken(`Token ${token}`);
        dispatch({ type: AccountActionTypes.LOGIN_PHONE, payload: user_info });
        history.replace(url);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  /** 获取当前用户信息 */
  const fetchAccount = async (): Promise<void> => {
    try {
      const getUserInfoRes = await getUserInfo();
      dispatch({ type: AccountActionTypes.UPDATE_INFO, payload: getUserInfoRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 更新账户信息 */
  const updateAccount = async (data: UpdateUserDataI, id = account.id): Promise<void> => {
    if (data.birthday) {
      data.birthday = moment(data.birthday).format("YYYY-MM-DD");
    }

    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const updateRes = await updateUserInfo(id, formData);
      dispatch({ type: AccountActionTypes.UPDATE_INFO, payload: updateRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 退出登录 */
  const logout = async (): Promise<void> => {
    try {
      await mcLogout();
      clearLocalStorage();

      history.push("/login");
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 个人用户退出登录 */
  const logoutPersonal = async (): Promise<void> => {
    try {
      await mcLogout();
      clearLocalStorage();

      history.push("/login");
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 注册 */
  const register = async (data: InviteRegisterDataI): Promise<void> => {
    try {
      const res = await InviteRegisterUser(data);
      const { token, user_info } = res;

      if (token) {
        setToken(`Token ${token}`);
        dispatch({ type: AccountActionTypes.REGISTER, payload: user_info });
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    wechatLogin,
    formLogin,
    phoneLogin,
    updateAccount,
    account,
    fetchAccount,
    personalPhoneLogin,
    logout,
    logoutPersonal,
    register,
  };
};
