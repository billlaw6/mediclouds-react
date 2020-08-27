import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI, AccountI } from "_types/api";
import { AccountActionTypes } from "_types/actions";
import userApi from "_api/user";
import { setToken } from "_helper";
import { useHistory } from "react-router";

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
  const phoneLogin = async (): Promise<void> => {
    try {
      const loginRes = await userApi.loginPhone();
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

  return { wechatLogin, formLogin, phoneLogin, user, account };
};
