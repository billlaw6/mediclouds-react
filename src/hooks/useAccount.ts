import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI, UpdateAccountDataI, AccountI } from "_types/account";
import { AccountActionTypes } from "_types/actions";
import userApi from "_api/user";
import { setToken, clearToken } from "_helper";
import { useHistory } from "react-router";
import moment from "antd/node_modules/moment";
import { FormLoginDataI, PhoneLoginDataI, RegisterDataI } from "_types/api";
import { store } from "../index";

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const account = useSelector<StoreStateI, UserI & { login: boolean }>((state) => state.account);

  /* 微信二维码登录 */
  const wechatLogin = async (params: any): Promise<void> => {
    try {
      const loginRes = await userApi.loginWechat(params);
      window.localStorage.clear();
      await store.persistor.purge();
      const { token, user_info } = loginRes;
      setToken(token);
      dispatch({ type: AccountActionTypes.LOGIN_WECHAT, payload: user_info });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 表单登录 */
  const formLogin = async (data: FormLoginDataI): Promise<void> => {
    try {
      const loginRes = await userApi.loginForm(data);
      window.localStorage.clear();
      // await store.persistor.purge();
      const { token, user_info } = loginRes;

      if (token) {
        setToken(token);
        dispatch({ type: AccountActionTypes.LOGIN_FORM, payload: user_info });
        history.replace("/manager");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 顾客手机号登录 */
  const personalPhoneLogin = async (data: PhoneLoginDataI, url = "/resources"): Promise<void> => {
    try {
      const loginRes = await userApi.loginPhone(data);
      window.localStorage.clear();
      // await store.persistor.purge();
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
  const phoneLogin = async (data: PhoneLoginDataI, url = "/manager"): Promise<void> => {
    try {
      const loginRes = await userApi.loginPhone(data);
      window.localStorage.clear();
      // await store.persistor.purge();
      const { token, user_info } = loginRes;
      if (token) {
        setToken(token);
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
      const getUserInfoRes = await userApi.getUserInfo();
      dispatch({ type: AccountActionTypes.UPDATE_INFO, payload: getUserInfoRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 更新账户信息 */
  const updateAccount = async (data: UpdateAccountDataI, id = account.id): Promise<void> => {
    if (data.birthday) {
      data.birthday = moment(data.birthday).format("YYYY-MM-DD");
    }

    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      const updateRes = await userApi.updateAccount(id, formData);
      dispatch({ type: AccountActionTypes.UPDATE_INFO, payload: updateRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 退出登录 */
  const logout = async (): Promise<void> => {
    try {
      await userApi.logout();
      clearToken();
      window.localStorage.clear();
      // await store.persistor.purge();
      history.push("/login");
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 个人用户退出登录 */
  const logoutPersonal = async (): Promise<void> => {
    try {
      await userApi.logoutPersonal();
      clearToken();
      window.localStorage.clear();
      // await store.persistor.purge();
      history.push("/login");
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 注册 */
  const register = async (data: RegisterDataI): Promise<void> => {
    try {
      const res = await userApi.register(data);
      const { token, user_info } = res;

      if (token) {
        setToken(token);
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
