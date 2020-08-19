import { SortTypeEnum, ViewTypeEnum } from "_pages/home/type";
import { CollectionI, GenderT, UserI, ExamIndexI } from "_types/api";

// Store相关接口
// 本地变量遵循js规范使用驼峰式全名，需要与后台数据库字段对应的变量使用下划线风格。
export declare interface LoginFormI {
  username: string;
  password: string;
  remember: boolean;
  messages: Array<string>;
}

export declare interface ProfileFormI {
  id: number;
  gender: number;
  birthday: Date;
  sign: string;
  address: string;
  username: string;
  unit: string;
  cell_phone: string;
}

export declare interface CurrentUserI {
  id: number;
  token: string;
  username: string;
  cell_phone: string;
  first_name?: string;
  last_name?: string;
  gender: number;
  birthday?: Date;
  sign: string;
  address: string;
  unit: string;
  avatar: string;
  privacy_notice: number;
  // user_permissions?: Array<number>;
}

// export declare interface UserInfoI {
//   id: number;
//   username: string;
//   email: string;
//   cell_phone: string;
//   openid: string;
//   unionid: string;
//   // 数组定义方法一
//   groups: number[];
//   first_name?: string;
//   last_name?: string;
//   pinyin?: string;
//   py?: string;
//   gender: number;
//   // 数组定义方法二
//   user_permissions: Array<number>;
// }

export declare interface SearchFormI {
  dtRange: Date[];
  keyword: string;
  fields?: string[];
}

export declare interface DicomPictureListI {
  id: string;
  mpr_order: number;
  frame_order: number;
  url: string;
}

export declare interface DicomPictureI {
  id: string;
  mpr_order: number;
  frame_order: number;
  collections: CollectionI[];
  url: string;
}

export declare interface DicomSeriesListI {
  id: string;
  series_number: number;
  mpr_flag: number;
  thumbnail: string;
}

export declare interface DicomSeriesI {
  id: string;
  thumbnail: string;
  study_id: string;
  patient_name: string;
  patient_id: string;
  sex: string;
  birthday: string;
  institution_name: string;
  window_width: number;
  window_center: number;
  modality: string;
  display_frame_rate: number;
  series_number: number;
  mpr_flag: number;
  pictures: DicomPictureListI[];
}

export declare interface ExamIndexListI {
  id: string;
  modality: string;
  patient_id: string;
  patient_name: string;
  sex: GenderT;
  birthday: string;
  institution_name: string;
  created_at: Date;
  desc: string;
  study_date: string;
  thumbnail: string;
  display_frame_rate: number;
}

export declare interface ExamIndexFormI {
  id: string;
  desc: string;
}

export declare interface RouteI {
  path: string;
  name: string;
  exact: boolean;
  component: React.Component;
  routes?: RouteI[];
  permission?: string[];
}

// 创建store时要遵循的rootState接口，不能使用rootReducers的类型
// 作为组件创建时props类型！！！必须用store.d里定义的！三天的教训！
export declare interface StoreStateI {
  router: { location: Location };
  token: string;
  user: UserI;
  examIndexList: ExamIndexI[];
  dicomSettings: {
    sortBy: SortTypeEnum;
    viewMode: ViewTypeEnum;
  };
}

export declare interface CustomHTMLDivElement extends HTMLDivElement {
  webkitRequestFullscreen: () => void;
  msRequestFullscreen: () => void;
  mozRequestFullScreen: () => void;
}

// interface Document {
//   exitFullscreen: any;
//   webkitExitFullscreen: any;
//   mozCancelFullScreen: any;
//   msExitFullscreen: any;
// }
export declare interface Document {
  exitFullscreen: () => void;
  webkitExitFullscreen: () => void;
  mozCancelFullScreen: () => void;
  msExitFullscreen: () => void;
}

export declare interface ActionI<T, K> {
  type: T;
  payload: K;
}

/* ACTIONS  */
// Api请求接口
export interface ApiFuncI {
  <T = any>(...args: any): Promise<T>;
}

// account Action Types
export enum AccountActionTypes {
  LOGIN_WECHAT = "login_wechat", // 微信二维码登录
  LOGIN_FORM = "login_form", // 表单登录
  LOGIN_PHONE = "login_phone", // 手机号登录
  LOGOUT = "logout", // 注销
  UPDATE_INFO = "update_user_info", // 更新账户信息
  GET_CUSTOMERS = "get_customers", // 获取当前用户下的顾客
  GET_AFFILIATEDS = "get_affiliateds", // 获取下属用户
  GET_BILLING = "get_billing", // 获取账单
  DEL = "del_user", // 删除用户
  CREATE = "create_user", // 创建用户
  GENERATE_QRCODE_REGISTRY = "generate_rqcode_registry", // 生成注册二维码
  GENERATE_QRCODE_PAY = "generate_rqcode_pay", // 生成付款二维码
}
