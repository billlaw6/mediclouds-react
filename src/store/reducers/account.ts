import { ReducerI } from "_types/reducer";
import { AccountActionTypes } from "_types/actions";
import { AccountI, RoleE, UserI } from "_types/account";
import { Reducer } from "redux";
import { ActionI } from "_types/core";

interface AccountStateI extends AccountI {
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
};

const accountReducer: Reducer<AccountStateI, ActionI<AccountActionTypes, AccountI>> = (
  state = DEFAULT_ACCOUNT,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.LOGIN_FORM:
    case AccountActionTypes.LOGIN_PHONE:
      return Object.assign({}, state, payload, { login: true });

    case AccountActionTypes.UPDATE_INFO:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};

export default accountReducer;
