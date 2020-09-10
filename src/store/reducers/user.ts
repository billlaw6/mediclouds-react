/* eslint-disable @typescript-eslint/camelcase */
import { CustomerI, RoleE } from "_types/account";
import { ReducerI } from "_types/reducer";
import { AccountActionTypes } from "_types/actions";

const DEFAULT_USER: CustomerI & { login: boolean } = {
  id: "",
  username: "",
  nickname: "",
  cell_phone: "",
  first_name: "",
  last_name: "",
  role: RoleE.PATIENT,
  unionid: "",
  recommended_users: [],
  certificate: [],
  score: 0,
  superior_id: "",
  sex: 0,
  age: "",
  sign: "",
  address: "",
  unit: "",
  avatar: "",
  privacy_notice: 0,
  birthday: "",
  date_joined: "",
  last_login: "",
  login: false,
};

const userReducer: ReducerI<CustomerI & { login: boolean }, AccountActionTypes, CustomerI> = (
  state = DEFAULT_USER,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.LOGIN_WECHAT: {
      return Object.assign({}, payload, { login: true });
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
