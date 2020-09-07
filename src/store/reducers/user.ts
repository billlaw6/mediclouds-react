/* eslint-disable @typescript-eslint/camelcase */
import { UserI, RoleE } from "_types/account";
import { setTokenAction, setUserAction, updateUserAction } from "_actions/user";
import * as types from "../action-types";

const defaultToken = "";

const tokenReducer = (state = defaultToken, action: ReturnType<typeof setTokenAction>): string => {
  switch (action.type) {
    case types.SET_TOKEN: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

const DEFAULT_USER: UserI = {
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
};

const userReducer = (
  state = DEFAULT_USER,
  action: ReturnType<typeof setUserAction> | ReturnType<typeof updateUserAction>,
): UserI => {
  switch (action.type) {
    case types.SET_USER: {
      console.log("action payload: ", action.payload as FormData);
      return {
        ...DEFAULT_USER,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export { tokenReducer, userReducer };
