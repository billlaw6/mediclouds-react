import { InputHTMLAttributes, DOMAttributes } from "react";

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

export declare interface CollectionI {
  id: string;
  type: string;
  data: any;
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
  sex: GenderEnum;
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

/* ===============  根据Tower文档整理的接口相关的interface =============== */
// 性别枚举
export enum GenderE {
  UNKNOW = 0,
  MALE = 1,
  FEMALE = 2,
}

// 是否是mpr类型 枚举
export enum MprFlagE {
  TRUE = 1,
  FALSE = 0,
}

export enum CollectionTypeE {
  MARK = "mark",
  SKETCH = "sketch",
}

// mpr顺序
export type MprOrderT = 0 | 1 | 2;

// 影像集
export interface ExamIndexI {
  id: string;
  modality: string;
  patient_name: string;
  thumbnail: string;
  desc: string;
  study_date: string;
  // created_at: Date;
  // patient_id: string;
  // institution_name: string;
  // display_frame_rate: number;
  // series: DicomSeriesListI[];
}

// 用户信息
export interface UserI {
  id: number;
  username: string;
  nickname: string;
  cell_phone: string;
  gender: GenderE;
  age: number;
  sign: string;
  address: string;
  unit: string;
  avatar: string;
  unionid?: string;
  privacy_notice: number;
  birthday: string;
  is_active?: boolean;
  is_superuser?: boolean;
  date_joined?: string;
  last_login?: string;
  file_count?: number;
  volumn_count?: number;
}

// 单张图片
export interface ImageI {
  id: string;
  mpr_order: MprOrderT;
  frame_order: number;
  url: string;
}

// 影像序列基础结构 - SeriesList内使用
export interface SeriesBasicI {
  id: string;
  series_number: number;
  mpr_flag: mprFlagE;
  window_width: number;
  window_center: number;
  thumbnail: string;
  display_frame_rate: number;
}

// 单个影像序列
export interface SeriesI extends SeriesBasicI {
  pictures: ImageI[];
}

export interface SeriesMprI extends SeriesBasicI {
  pictures: ImageI[][];
}

// 影像序列列表
export interface SeriesListI {
  patient_name: string;
  patient_id: string;
  sex: string;
  birthday: string;
  institution_name: string;
  study_date: string;
  modality: string;
  children: SeriesI[];
}

// 作品集
export interface CollectionI {
  id?: string;
  dicom_pic_id: string;
  type: CollectionTypeE;
  modality: string;
  patient_name: string;
  study_date: string;
  thumbnail?: string;
  title: string;
  data: string; // 作品集数据
  share_data: string; // 合成的图片地址 作为分享用
}

// 标签
export interface TagI {
  id?: number;
  content: string;
  auth_flag: number;
}

// 用户反馈类型
export interface FeedbackTypeI {
  code: string;
  title: string;
}

// // 用户反馈回复
// export interface FeedbackReplyI {
//   owner: string;
//   title: string;
//   content: string;
//   created_at: string;
// }

// 用户反馈
export interface FeedbackI {
  owner: string;
  title: string;
  content: string;
  created_at: string;
  replies?: FeedbackReply[];
}

// 反馈回复
export interface FeedbackReplyI {
  type_id: string;
  title?: string;
  content: string;
}

// 用户协议
export interface PrivacyNoticeI {
  id: 0 | number;
  content: string;
}

// 图集
export interface GalleryI {
  [key: string]: any;
  id?: string; // 唯一id
  upload_to: string; // 上传文件路径
  md5: string; // 文件的MD5值
  source: string; // 来源类型
  doi: string; // 文章DOI值
  title: string; // 文章标题
  journal: string; // 杂志
  authors: string; // 作者
  source_url: string; // 资源链接
  description: string; // 描述
  figure_series: string; // 图片在文章里的序列号
  picture: string; // 图片url地址数组
  dicom_flag: number; // 是否是DICOM文件
  flag: number; // 可视标志
  published_at: string; // 文章发表时间
  created_at: string; // 资源收录时间
  series_id: string; // 序列号
}

export interface GalleryByTable {
  [key: string]: any;
  id?: string; // 唯一id
  upload_to: string; // 上传文件路径
  md5: string; // 文件的MD5值
  source: string; // 来源类型
  doi: string; // 文章DOI值
  title: string; // 文章标题
  title_en: string; // 英文标题
  journal: string; // 杂志
  authors: string; // 作者
  source_url: string; // 资源链接
  description: string; // 描述
  description_en: string; // 英文描述
  figure_series: string; // 图片在文章里的序列号
  pictures: string[]; // 图片url地址数组
  dicom_flag: "是" | "否"; // 是否是DICOM文件
  flag: "是" | "否"; // 可视标志
  published_at: string; // 文章发表时间
  created_at: string; // 资源收录时间
  series_id: string; // 序列号
  edit: JSX.Element;
}

/* ===============  根据Tower文档整理的接口相关的interface END =============== */

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

interface Document {
  exitFullscreen: any;
  webkitExitFullscreen: any;
  mozCancelFullScreen: any;
  msExitFullscreen: any;
}
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
