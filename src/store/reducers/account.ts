import { ReducerI } from "_types/reducer";
import { AccountActionTypes } from "_types/actions";
import { AccountI, RoleE, UserI } from "_types/account";
import { generateAccount } from "../../mock";

const _ACCOUNT: AccountI =
  process.env.NODE_ENV === "development"
    ? generateAccount()
    : {
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
      };
const DEFAULT_ACCOUNT: AccountI & { login: boolean } = Object.assign({}, _ACCOUNT, {
  login: false,
  role: RoleE.SUPER_ADMIN,
});

const accountReducer: ReducerI<AccountI & { login: boolean }, AccountActionTypes, AccountI> = (
  state = DEFAULT_ACCOUNT,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.LOGIN_FORM:
    case AccountActionTypes.LOGIN_PHONE:
      return { login: true, ...payload };

    case AccountActionTypes.UPDATE_INFO:
      return Object.assign({}, state, payload);
    default:
      return state;
  }
};

export default accountReducer;
