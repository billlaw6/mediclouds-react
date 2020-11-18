import { AccountActionTypes } from "_types/actions";
import { UserI, RoleE } from "_types/account";
import { Reducer } from "redux";
import { ActionI } from "_types/core";

interface AccountStateI extends UserI {
  login: boolean;
}

const DEFAULT_ACCOUNT: AccountStateI = {
  id: "",
  username: "",
  nickname: "",
  cell_phone: "",
  sex: 0,
  age: "",
  avatar: "",
  certificate: [],
  role: RoleE.EMPLOYEE,
  first_name: "",
  last_name: "",
  sign: "",
  business_name: "",
  birthday: "",
  pay_qrcode: "",
  register_qrcode: "",
  unit: "",
  recommended_users: [],
  superior_id: "",
  date_joined: "",
  last_login: "",
  is_active: 0,
  login: false,
  address: "",
  unionid: "",
  score: 0,
  privacy_notice: -1,
};

const accountReducer: Reducer<AccountStateI, ActionI<AccountActionTypes, UserI>> = (
  state = DEFAULT_ACCOUNT,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.REGISTER:
    case AccountActionTypes.LOGIN_FORM:
    case AccountActionTypes.LOGIN_PHONE:
    case AccountActionTypes.LOGIN_WECHAT:
    case AccountActionTypes.PERSONAL_LOGIN_PHONE:
      return Object.assign({}, state, payload, { login: true });

    case AccountActionTypes.UPDATE_INFO:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};

export default accountReducer;
