import { useSelector, useDispatch } from "react-redux";
import { StoreStateI } from "_types/core";
import { UserI } from "_types/api";
import { AccountActionTypes } from "_types/actions";
import { loginUser, wechatLogin as _wechatLogin } from "_api/user";
import { setToken } from "_helper";

export default () => {
  const dispatch = useDispatch();
  const user = useSelector<StoreStateI, UserI>((state) => state.user);

  const wechatLogin = async (params: any): Promise<void> => {
    try {
      const loginRes = await _wechatLogin(params);
      const { token, userInfo } = loginRes;
      setToken(token);
      dispatch({ type: AccountActionTypes.LOGIN_WECHAT, payload: userInfo });
    } catch (error) {
      throw new Error(error);
    }
  };

  return { wechatLogin, user };
};
