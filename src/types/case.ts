import { SexT } from "./api";
import { ExamIndexI, ImgI, PdfI } from "./resources";

/* 病例类型 */
export enum CaseTypeE {
  MINE = "mine",
  READ_RECORD = "read_record",
}

/** 病例Actions */
export enum CaseActionE {
  GET_MINE_LIST = "get_mine_list", // 获取本人的病例列表
  DEL_MINE_LIST = "del_mine_list", // 删除本人的病例列表

  GET_READ_RECORD_LIST = "get_read_record_list", // 获取已查看过的病例列表
  DEL_READ_RECORD_LIST = "del_read_record_list", // 删除已查看过的病例列表

  SELECT_CASE = "select_case", // 选择当前的case

  SET_SORT_BY_KEY = "set_sort_by_key", // 切换排序字段

  SWITCH_CASE_TAB_TYPE = "switch_case_tab_type", // 切换病例tab类型
}
/** 病例分享结构 */
export interface CaseShareI {
  id: string; // 此分享的id
  case: string; // 分享的病例ID
  publisher: string; // 分享人的ID
  reader: string; // 阅读人的ID
}

/** 病例结构 */
export interface CaseI {
  id: string; // 病例id
  exam_objs: ExamIndexI[];
  image_objs: ImgI[];
  pdf_objs: PdfI[];
  case_read_record_objs: CaseShareI[];
  name: string; // 病人姓名
  sex: SexT; // 病人性别
  birthday: string; // 生日
  description: string; // 病例描述
  share_limit: number; // 分享限制人数
  case_share_count: number; // 已分享的人数
  created_at: string; // 创建病例时间
  updated_at: string; // 修改病例时间
  owner: string; // 病例所有人的ID
  flag: 0 | 1; // 是否开启分享
  editable: 0 | 1; // 是否可编辑
}
