import { Moment } from "moment";

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
  date_joined: string; // 注册日期
  last_login: string; // 最后登录日期
  is_active: 0 | 1; // 账户状态 0: 失效 1: 有效
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
  certificate: string[]; // 资质证书图片地址列表
  age: string; // 年龄
  birthday: string; // 生日
  unit: string; // 单位
  sex: 0 | 1 | 2; // 性别
  sign: string; // 签名
  register_qrcode: string; // 邀请注册二维码
  pay_qrcode: string; // 付款二维码
  recommended_users: RecommendedUserI[]; // 邀请人列表
}

/* 顾客 */
export interface CustomerI extends AccountBaseI {
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
  certificate: string[]; // 资质证书图片地址列表
  recommended_users: RecommendedUserI[];
  score: number; // 积分
  privacy_notice: number; // 隐私政策版本 0：没有同意过
  my_ai_reports: number; // 用户AI筛查报告数量
  my_case_files: number; // 用户病例数量
  my_dicom_files: number; // 用户dicom数量
}

/* 用户 包含 账户和顾客 用于全局的路由、权限判断 */
export interface UserI extends CustomerI, AccountI {}

/* 创建账户Data */
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

/* 更新账户Data */
export interface UpdateAccountDataI {
  [key: string]: any;
  username?: string;
  password?: string;
  cell_phone?: string;
  avatar?: File;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  email?: string;
  nickname?: string;
  certificate?: File[];
  superior_id?: string;
  role?: RoleE;
  birthday?: string | Moment;
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

/* 账户表单的登录Data */
export interface AccountFormLoginDataI {
  username: string;
  password: string;
  captcha: string;
}
