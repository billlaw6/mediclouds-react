/* ACTIONS  */

// account Action Types
export enum AccountActionTypes {
  LOGIN_WECHAT = "login_wechat", // 微信二维码登录
  LOGIN_FORM = "login_form", // 表单登录
  LOGIN_PHONE = "login_phone", // 手机号登录
  LOGOUT = "logout", // 注销
  UPDATE_INFO = "update_info", // 更新账户信息
  GET_CUSTOMERS = "get_customers", // 获取当前用户下的顾客
  GET_AFFILIATEDS = "get_affiliateds", // 获取下属用户
  GET_BILLING = "get_billing", // 获取账单
  DEL = "del_user", // 删除用户
  CREATE = "create_user", // 创建用户
  GENERATE_QRCODE_REGISTRY = "generate_rqcode_registry", // 生成注册二维码
  GENERATE_QRCODE_PAY = "generate_rqcode_pay", // 生成付款二维码
}
