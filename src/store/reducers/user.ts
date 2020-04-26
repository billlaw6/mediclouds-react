/* eslint-disable @typescript-eslint/camelcase */
import { UserI } from "_constants/interface";
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

const defaultUser: UserI = {
  id: -1,
  username: "",
  nickname: "",
  cell_phone: "",
  gender: 0,
  age: 0,
  sign: "",
  address: "",
  unit: "",
  avatar: "",
  privacy_notice: 0,
  birthday: "",
};

const userReducer = (
  state = defaultUser,
  action: ReturnType<typeof setUserAction> | ReturnType<typeof updateUserAction>,
): UserI => {
  switch (action.type) {
    case types.SET_USER: {
      console.log("action payload: ", action.payload as FormData);
      return {
        ...defaultUser,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export { tokenReducer, userReducer };
