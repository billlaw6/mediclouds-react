import Mock from "mockjs";

const generateAccount = () =>
  Mock.mock({
    id: "@GUID",
    username: "@CNAME",
    nickname: "@CNAME",
    cell_phone: "@NATURAL(13500000000,18900000000)",
    age: "@NATURAL(0, 100)",
    gender: "@NATURAL(0, 1)",
    privacy_notice: "@NATURAL(0, 10)",
    avatar: "@IMAGE('200x200')",
    birthday: "@DATE",
    "user_type|1": ["super_admin"],
  });

if (process.env.NODE_ENV === "development") {
  Mock.setup({ timeout: "50-1000" });
  console.log("mock serivce");

  /* 表单登录 */
  Mock.mock("/public-api/user/login-form", "post", {
    token: "@GUID",
    accountInfo: generateAccount(),
  });
  /* 手机号登录 */
  Mock.mock("/public-api/user/login-phone", "post", {
    token: "@GUID",
    accountInfo: generateAccount(),
  });
}
