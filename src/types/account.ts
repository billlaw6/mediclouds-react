// 账户状态
export enum AccountStatusE {
  LOGIN = "login", // 登录
  LOGOUT = "logout", // 退出
  DISABLED = "disabled", // 禁用
}

/* 角色 */
export enum RoleE {
  SUPER_ADMIN = "super_admin", // 超级管理员
  BUSINESS = "business", // 企业用户
  MANAGER = "manager", // 经理用户
  EMPLOYEE = "employee", // 员工用户
  DOCTOR = "doctor", // 医生
  PATIENT = "patient", // 病人
}

/* 账户基础信息 */
export interface AccountBaseI {
  id: string;
  username: string; // 登录账户名&生成的用户名
  avatar: string; // 头像地址
  role: RoleE; // 用户角色
  superior_id: string; // 上级账户
  cell_phone: string; // 手机号
}

/* 邀请的用户基本信息 */
export interface RecommendedUserI {
  id: string;
  nickname: string;
}

/* 账户 */
export interface AccountI extends AccountBaseI {
  first_name: string; // 姓
  last_name: string; // 名
  nickname: string; // 昵称
  business_name: string; // 企业用户名
  age: string; // 年龄
  birthday: string; // 生日
  unit: string; // 单位
  sex: 0 | 1 | 2; // 性别
  sign: string; // 签名
  register_qrcode: string; // 邀请注册二维码
  pay_qrcode: string; // 付款二维码
  recommended_users: RecommendedUserI[]; // 邀请人列表
}

/* 用户 */
export interface UserI extends AccountBaseI {
  first_name: string;
  last_name: string;
  nickname: string;
  age: string;
  birthday: string;
  address: string; // 地址
  unit: string;
  unionid: string; // 微信生成的unionid
  sex: 0 | 1 | 2;
  sign: string;
  recommended_users: RecommendedUserI[];
  score: number; // 积分
  privacy_notice: number; // 隐私政策版本 0：没有同意过
}

/* 创建用户Data */
export interface CreateAccountDataI {
  username: string;
  password: string;
  cell_phone: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  email?: string;
  nickname?: string;
}

/* 统计信息 */
export interface StatsI {
  case: number; // 病例数
  customer: number; // 用户数
  dicom_size: number; // dicom磁盘占用量
  pdf_size: number; // pdf磁盘占用量
  image_size: number; // 图片磁盘占用量
  order: number; // 订单数量
  account: number; // 下属账户数量
}
