import { ReducerI } from "_types/reducer";
import { AccountActionTypes } from "_types/actions";
import { AccountI, RoleE } from "_types/account";

const DEFAULT_ACCOUNT: AccountI & { login: boolean } = {
  id: "",
  username: "",
  nickname: "",
  cell_phone: "",
  sex: 0,
  age: "",
  avatar: "",

  login: false,
  role: RoleE.SUPER_ADMIN,
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
};

const accountReducer: ReducerI<AccountI & { login: boolean }, AccountActionTypes, AccountI> = (
  state = DEFAULT_ACCOUNT,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.LOGIN_FORM:
    case AccountActionTypes.LOGIN_PHONE:
      return { login: true, ...payload };
    default:
      return state;
  }
};

export default accountReducer;
