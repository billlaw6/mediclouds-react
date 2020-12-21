import { SeriesI } from "./api";

export enum ResourcesActionE {
  GET_EXAM_LIST = "get_exam_list", // 获取检查列表
  DEL_EXAM_LIST = "del_exam_list", // 删除检查列表

  GET_PDF_LIST = "get_pdf_list", // 获取pdf列表
  DEL_PDF_LIST = "del_pdf_list", // 删除pdf列表

  GET_IMG_LIST = "get_img_list", // 获取图片列表
  DEL_IMG_LIST = "del_img_list", // 删除图片列表

  GET_LUNG_NODULES_REPORT = "get_lung_nodules_report", // 获取肺结节筛查报告
  DEL_LUNG_NODULES_REPORT = "del_lung_nodules_report", // 删除肺结节筛查报告

  SET_SORT_BY_KEY = "set_sort_by_key", // 切换排序字段

  SWITCH_RESOURCES_TYPE = "switch_resources_type", // 切换资料tab类型
}

/* 资源类型 */
export enum ResourcesTypeE {
  EXAM = "exam",
  PDF = "pdf",
  IMG = "img",
  LUNG_NODULES_REPORT = "lung_nodules_report",
}

/* Exam 排序字段 */
export enum ExamSortKeyE {
  STUDY_DATE = "study_date",
  MODALITY = "modality",
}

/* PDF IMG 排序字段 */
export enum ImgAndPdfSortKeyE {
  CREATED_AT = "created_at",
  FILENAME = "filename",
}

/* 报告排序字段 */
export enum ReportSortKeyE {
  CREATED_AT = "created_at",
}

/* 检查结构 */
export interface ExamIndexI {
  id: string;
  modality: string;
  patient_name: string;
  thumbnail: string;
  desc: string;
  study_date: string;
  lung_nodule_flag: 0 | 1; // 是否可以做肺结节筛查 0:N 1:Y
  children: SeriesI[];
  anonymous_flag: 0 | 1; // 是否匿名
}

/* pdf结构 */
export interface PdfI {
  id: number;
  filename: string; // 文件名
  url: string; // 远程地址
  created_at: string; // 创建时间
  desc?: string; // 描述
}

/* 图片结构 */
export interface ImgI {
  id: number;
  url: string; // 远程地址
  created_at: string; // 创建时间
  filename: string; // 文件名
  thumbnail: string; // 缩略图
  desc?: string; // 描述
}

/* 资源删除Data结果 */
export interface ResourcesDelDataI {
  exam?: string[];
  img?: string[];
  pdf?: string[];
}
