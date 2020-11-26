/* eslint-disable @typescript-eslint/camelcase */
import { UserI, RoleE } from "_types/account";
import { AccountActionTypes } from "_types/actions";
import { Reducer } from "redux";
import { ActionI } from "_types/core";

interface CustomerStateI extends UserI {
  login: boolean;
}

const DEFAULT_USER: CustomerStateI = {
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
  is_active: 0,
  business_name: "",
  register_qrcode: "",
  pay_qrcode: "",
  my_dicom_files: 0,
  my_case_files: 0,
  my_ai_reports: 0,
};

const userReducer: Reducer<CustomerStateI, ActionI<AccountActionTypes, UserI>> = (
  state = DEFAULT_USER,
  action,
) => {
  const { type, payload } = action;

  switch (type) {
    case AccountActionTypes.PERSONAL_LOGIN_PHONE:
    case AccountActionTypes.LOGIN_WECHAT: {
      return Object.assign({}, payload, { login: true });
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
