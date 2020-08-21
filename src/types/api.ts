/* ===============  根据Tower文档整理的接口相关的interface =============== */
// 对公账户类型
export enum AccountTypeE {
  SUPER_ADMIN = "super_admin", // 超级管理员
  BUSINESS = "business", // 企业用户
  SUPER_STAFF = "super_staff", // 经理用户
  STAFF = "staff", // 员工用户
}
// 顾客账户类型
export enum CustomerTypeE {
  DOCTOR = "doctor", // 医生
  PATIENT = "patient", // 病人
}

// 账户状态
export enum AccountStatusE {
  LOGIN = "login", // 登录
  LOGOUT = "logout", // 退出
  DISABLED = "disabled", // 禁用
}

// 性别
export type GenderT = 0 | 1 | 2;
// 是否为mpr
export type mprFlagT = 0 | 1;

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
  gender: GenderT;
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
  mpr_flag: mprFlagT;
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
export interface SeriesListI extends PatientExamI {
  // patient_name: string;
  // patient_id: string;
  // sex: string;
  // birthday: string;
  // institution_name: string;
  // study_date: string;
  // modality: string;
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

// 用户反馈回复
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
  replies?: FeedbackReplyI[];
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

// 图集信息
export interface GalleryStatsI {
  total: number;
  image_type: string;
  image_type_name: string;
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
  image_type: string; // 图像类型
  image_type_name: string; // 图像类型名称
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

// 病人检查信息
export interface PatientExamI {
  patient_name: string; //	病人姓名
  patient_id: string; //	病人ID
  sex: string; //	病人性别
  birthday: string; //	病人生日
  institution_name: string; //	检查单位
  study_date: string; //	检查日期
  modality: string; //	检查类型
}

/* ===============  根据Tower文档整理的接口相关的interface END =============== */

// Api请求接口
export interface ApiFuncI {
  <T = any>(...args: any): Promise<T>;
}
