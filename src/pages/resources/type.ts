import { ExamIndexI } from "_types/api";
import { AccountI, CustomerI } from "_types/account";
import {
  getExamIndexListAction,
  deleteExamIndexListAction,
  SetViewSortByAction,
  setViewModeAction,
} from "_actions/dicom";
import { RouteComponentProps } from "react-router";
import { ReactElement } from "react";
import { getExamList } from "_actions/resources";
import { ImgI, PdfI } from "_types/resources";

export interface MapStateToPropsI {
  examIndexList: ExamIndexI[];
  user: CustomerI;
  account: AccountI;
  dicomSettings: {
    sortBy: SortTypeEnum;
    viewMode: ViewTypeEnum;
  };
}
export interface MapDispatchToPropsI {
  getList: typeof getExamList;
  delList: typeof deleteExamIndexListAction;
  setSortBy: typeof SetViewSortByAction;
  setViewMode: typeof setViewModeAction;
}

export type ResourcesPropsI = MapStateToPropsI & MapDispatchToPropsI & RouteComponentProps;
export interface ResourcesStateI {
  viewType: ViewTypeEnum; // 视图模式
  sortType: SortTypeEnum; // 排序规则
  isSelectable: boolean; // 是否是可选择的
  page: number; // 当前在第几页 从1开始
  selections: string[]; //当前已选择的dicom id 集
  redirectUpload: boolean; // 是否重定向到upload页
  parsing: number; // 剩余解析量
  showNotify: boolean; // 是否显示提示
  poll: boolean; // 是否开启轮询
  pageSize: number; // 每页展示的数量
  pdfList: PdfI[]; // pdf列表
  imgList: ImgI[]; // pdf列表
}

// 排序类型
export enum SortTypeEnum {
  TIME = "time",
  TYPE = "type",
}

// 视图类型
export enum ViewTypeEnum {
  GRID = "grid",
  LIST = "list",
}

export interface TableDataI {
  id: string;
  modality: string;
  patient_name: string;
  // created_at: Date;
  desc: string | ReactElement;
  // patient_id: string;
  // institution_name: string;
  study_date: string;
  thumbnail: string;
}

/**
 * 表格形式desc编辑模块
 *
 * @interface ListDescPropsI
 */
export interface ListDescPropsI {
  desc: string;
  updateDesc: Function;
}
