import Mock from "mockjs";
import { AccountI } from "_types/api";
import { retry } from "redux-saga/effects";

interface GenerateAccountPorpsI {
  isSuper?: boolean;
  isCustomer?: boolean;
}

const generateAccount = (props?: GenerateAccountPorpsI): AccountI => {
  let userTypeList = ["employee", "manager", "business"];
  if (props) {
    const { isSuper, isCustomer } = props;
    if (isCustomer) {
      userTypeList = ["patient", "doctor"];
    }
    isSuper && userTypeList.push("super_admin");
  }

  return Mock.mock({
    id: "@GUID",
    username: "@CNAME",
    nickname: "@CNAME",
    first_name: "@CFIRST",
    last_name: "@CLAST",
    cell_phone: "@NATURAL(13500000000,18900000000)",
    age: "@NATURAL(0, 100)",
    sex: "@NATURAL(0, 1)",
    privacy_notice: "@NATURAL(0, 10)",
    avatar: "@IMAGE('200x200')",
    birthday: "@DATE",
    "role|1": userTypeList,
  });
};

if (process.env.NODE_ENV === "development") {
  Mock.setup({ timeout: "50-1000" });
  console.log("mock serivce");

  /* 表单登录 */
  Mock.mock("/public-api/user/login-form", "post", {
    token: "@GUID",
    accountInfo: generateAccount({ isSuper: true }),
  });
  /* 手机号登录 */
  Mock.mock("/public-api/user/login-phone", "post", {
    token: "@GUID",
    accountInfo: generateAccount({ isSuper: true }),
  });

  /* 获取下属账户信息 */
  Mock.mock("/public-api/user/affiliated-list", "get", () => {
    const result = [];

    for (let i = 0; i < 50; i++) {
      result.push(generateAccount());
    }

    return result;
  });

  /* 获取下属用户信息 */
  Mock.mock("/public-api/user/customer-list", "get", () => {
    const result = [];

    for (let i = 0; i < 20; i++) {
      result.push(generateAccount({ isCustomer: true }));
    }

    return result;
  });

  Mock.mock("/public-api/user/create", "post", () => generateAccount());
}
