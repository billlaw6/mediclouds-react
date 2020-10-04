import Mock from "mockjs";
import { AccountI } from "_types/account";

interface GenerateAccountPorpsI {
  isSuper?: boolean;
  isCustomer?: boolean;
}

export const generateAccount = (props?: GenerateAccountPorpsI): AccountI => {
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
    username: "@WORD(5,10)",
    nickname: "@CNAME",
    first_name: "@CFIRST",
    last_name: "@CLAST",
    cell_phone: "@NATURAL(13500000000,18900000000)",
    certificate: [],
    age: "@NATURAL(0, 100)",
    sex: "@NATURAL(0, 1)",
    privacy_notice: "@NATURAL(0, 10)",
    avatar: "@IMAGE('200x200')",
    birthday: "@DATE",
    "role|1": userTypeList,
    business_name: "@CTITLE",
    "recommended_users|1-100": [{ id: "@GUID", nickname: "@CNAME" }],
    register_qrcode: "https://www.baidu.com",
    pay_qrcode: "https://www.bing.com",
    date_joined: "@DATE",
    last_login: "@DATE",
  });
};

const generateOrder = () =>
  Mock.mock({
    id: "@GUID",
    order_number: "@NATURAL",
    customer_id: "@GUID",
    customer_first_name: "@CFIRST",
    customer_last_name: "@CLAST",
    creator_id: "@GUID",
    creator_username: "@WORD(5,10)",
    created_at: "@DATE",
    updated_at: "@DATE",
    charged_at: "@DATE",
    expire_date: "@DATE",
    uploaded_resources: "@NATURAL(0, 1000)",
    "flag|1": [0, 1, 2, 3, 4],
    comment: "@CSENTENCE",
  });

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
  Mock.mock(/\/public-api\/user\/account-list\/*/, "get", () => {
    const result = [];

    for (let i = 0; i < 50; i++) {
      result.push(generateAccount());
    }

    return result;
  });

  /* 获取下属用户信息 */
  Mock.mock(/\/public-api\/user\/customer-list\/*/, "get", () => {
    const result = [];

    for (let i = 0; i < 20; i++) {
      result.push(generateAccount({ isCustomer: true }));
    }

    return result;
  });

  /* 创建新用户 */
  Mock.mock("/public-api/user/create", "post", () => generateAccount());

  /* 获取用户统计信息 */
  Mock.mock(/\/public-api\/stats\/*/, "get", {
    case: "@NATURAL(0, 1000)",
    customer: "@NATURAL(0, 2000)",
    dicom_size: "@FLOAT(0, 1024000)",
    pdf_size: "@FLOAT(0, 1024000)",
    image_size: "@FLOAT(0, 1024000)",
    order: "@NATURAL(0, 1500)",
    account: "@NATURAL(0, 200)",
  });

  /* 获取订单列表 */
  Mock.mock(/\/public-api\/order\/list\/*/, "get", () => {
    const result = [];

    for (let i = 0; i < 40; i++) {
      result.push(generateOrder());
    }

    return result;
  });

  /* 创建订单 */
  Mock.mock("/public-api/order/create", "post", () => generateOrder());

  /* 更新账户信息 */
  Mock.mock(/\/public-api\/user\/update\/*/, "post", () => generateAccount());
}
