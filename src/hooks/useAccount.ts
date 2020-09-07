import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI, UpdateAccountDataI } from "_types/account";
import { AccountI } from "_types/account";
import { AccountActionTypes } from "_types/actions";
import userApi from "_api/user";
import { setToken } from "_helper";
import { useHistory } from "react-router";
import moment from "antd/node_modules/moment";
import { LoginPhoneDataI } from "_types/api";

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector<StoreStateI, UserI>((state) => state.user);
  const account = useSelector<StoreStateI, AccountI & { login: boolean }>((state) => state.account);

  /* 微信二维码登录 */
  const wechatLogin = async (params: any): Promise<void> => {
    try {
      const loginRes = await userApi.loginWechat(params);
      const { token, userInfo } = loginRes;
      setToken(token);
      dispatch({ type: AccountActionTypes.LOGIN_WECHAT, payload: userInfo });
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 表单登录 */
  const formLogin = async (): Promise<void> => {
    try {
      const loginRes = await userApi.loginForm();
      const { token, accountInfo } = loginRes;

      if (token) {
        setToken(token);
        dispatch({ type: AccountActionTypes.LOGIN_FORM, payload: accountInfo });
        history.replace("/manager");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  /* 手机号登录 */
  const phoneLogin = async (data: LoginPhoneDataI): Promise<void> => {
    try {
      const loginRes = await userApi.loginPhone(data);
      const { token, accountInfo } = loginRes;
      if (token) {
        setToken(token);
        dispatch({ type: AccountActionTypes.LOGIN_PHONE, payload: accountInfo });
        history.replace("/manager");
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
    console.log("data", data);
    try {
      const updateRes = await userApi.updateAccount(id, data);
      dispatch({ type: AccountActionTypes.UPDATE_INFO, payload: updateRes });
    } catch (error) {
      throw new Error(error);
    }
  };

  return { wechatLogin, formLogin, phoneLogin, updateAccount, user, account };
};
