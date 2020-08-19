import { useSelector, useDispatch } from "react-redux";
import { StoreStateI, ActionI, AccountActionTypes } from "_types/core";
import { UserI } from "_types/api";
import { loginUser } from "_api/user";

export default () => {
  const dispatch = useDispatch();
  const user = useSelector<StoreStateI, UserI>((state) => state.user);

  const login = async (params: any): Promise<void> => {
    try {
      const loginRes = await loginUser(params);
      const { token, userInfo } = loginRes as any;
      dispatch({ type: AccountActionTypes.LOGIN_WECHAT, payload: loginRes.data });
    } catch (error) {
      throw new Error(error);
    }
  };

  return { login, user };
};
