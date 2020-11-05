import { CollectionI, SexT } from "_types/api";
import { AnyAction } from "redux";
import reducer from "../store/reducers";

// Store相关接口
// 本地变量遵循js规范使用驼峰式全名，需要与后台数据库字段对应的变量使用下划线风格。
export interface LoginFormI {
  username: string;
  password: string;
  remember: boolean;
  messages: Array<string>;
}

export interface ProfileFormI {
  id: number;
  sex: number;
  birthday: Date;
  sign: string;
  address: string;
  username: string;
  unit: string;
  cell_phone: string;
}

export interface CurrentUserI {
  id: number;
  token: string;
  username: string;
  cell_phone: string;
  first_name?: string;
  last_name?: string;
  sex: number;
  birthday?: Date;
  sign: string;
  address: string;
  unit: string;
  avatar: string;
  privacy_notice: number;
  // user_permissions?: Array<number>;
}

export interface SearchFormI {
  dtRange: Date[];
  keyword: string;
  fields?: string[];
}

export interface DicomPictureListI {
  id: string;
  mpr_order: number;
  frame_order: number;
  url: string;
}

export interface DicomPictureI {
  id: string;
  mpr_order: number;
  frame_order: number;
  collections: CollectionI[];
  url: string;
}

export interface DicomSeriesListI {
  id: string;
  series_number: number;
  mpr_flag: number;
  thumbnail: string;
}

export interface DicomSeriesI {
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

export interface ExamIndexListI {
  id: string;
  modality: string;
  patient_id: string;
  patient_name: string;
  sex: SexT;
  birthday: string;
  institution_name: string;
  created_at: Date;
  desc: string;
  study_date: string;
  thumbnail: string;
  display_frame_rate: number;
}

export interface ExamIndexFormI {
  id: string;
  desc: string;
}

export interface RouteI {
  path: string;
  name: string;
  exact: boolean;
  component: React.Component;
  routes?: RouteI[];
  permission?: string[];
}

// state 结构
export type StoreStateI = ReturnType<typeof reducer>;

export declare interface CustomHTMLDivElement extends HTMLDivElement {
  webkitRequestFullscreen: () => void;
  msRequestFullscreen: () => void;
  mozRequestFullScreen: () => void;
}
export declare interface Document {
  exitFullscreen: () => void;
  webkitExitFullscreen: () => void;
  mozCancelFullScreen: () => void;
  msExitFullscreen: () => void;
}

export interface ActionI<T, P> extends AnyAction {
  type: T;
  payload?: P;
}
