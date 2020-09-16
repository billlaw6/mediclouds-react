import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { CustomerI, UpdateAccountDataI } from "_types/account";
import { AccountI } from "_types/account";
import { AccountActionTypes } from "_types/actions";
import userApi from "_api/user";
import { setToken, clearToken } from "_helper";
import { useHistory } from "react-router";
import moment from "antd/node_modules/moment";
import { FormLoginDataI, PhoneLoginDataI, RegisterDataI, UserI } from "_types/api";
import { store } from "../index";

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector<StoreStateI, CustomerI>((state) => state.user);
  const account = useSelector<StoreStateI, AccountI & { login: boolean }>((state) => state.account);

  // /* 开发表单登录 */
  // const _devFormLogin = async ({
  //   username,
  //   password,
  // }: {
  //   username: string;
  //   password: string;
  // }): Promise<void> => {
  //   try {
  //     clearToken();

  //     const loginRes = await devFormLogin({ username, password });
  //     console.log("dev form login", loginRes);
  //     const { key } = loginRes;

  //     // setToken(key);
  //     // dispatch({ type: AccountActionTypes.LOGIN_FORM, payload: {} });

  //     // history.replace("/resources");
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };
  // /* 顾客表单登录 */
  // const customerFormLogin = async ({
  //   username,
  //   password,
  // }: {
  //   username: string;
  //   password: string;
  // }) => {
  //   try {
  //     const loginRes = await loginUser({ username, password });
  //     // const { token, userInfo } = loginRes;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // };

  /* 微信二维码登录 */
  const wechatLogin = async (params: any): Promise<void> => {
    try {
      const loginRes = await userApi.loginWechat(params);
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

  /* 手机号登录 */
  const phoneLogin = async (data: PhoneLoginDataI, url = "/manager"): Promise<void> => {
    try {
      const loginRes = await userApi.loginPhone(data);
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
      await store.persistor.purge();
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
        history.replace("/");
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
    user,
    account,
    // devFormLogin: _devFormLogin,
    logout,
    register,
  };
};
