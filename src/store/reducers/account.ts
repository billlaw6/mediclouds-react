import { ReducerI } from "_types/reducer";
import { AccountActionTypes } from "_types/actions";
import { AccountI, AccountTypeE } from "_types/api";

const DEFAULT_ACCOUNT: AccountI & { login: boolean } = {
  id: "",
  username: "",
  nickname: "",
  cell_phone: 0,
  sex: 0,
  age: 0,
  avatar: "",
  privacy_notice: 0,
  birthday: "",
  login: false,
  role: AccountTypeE.EMPLOYEE,
  first_name: "",
  last_name: "",
  sign: "",
  address: "",
  unit: "",
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
