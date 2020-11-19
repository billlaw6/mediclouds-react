import { PatientExamI, SeriesBasicI } from "_types/api";

/* 默认病人检查信息 */
export const DEFALUT_PATIENT_INFO: PatientExamI = {
  patient_name: "NA",
  patient_id: "NA",
  birthday: "NA",
  sex: "NA",
  study_date: "NA",
  institution_name: "NA",
  modality: "NA",
};

/* 默认序列基础信息 */
export const DEFAULT_SERIES: SeriesBasicI = {
  id: "",
  series_number: 0,
  mpr_flag: 0,
  window_width: 0,
  window_center: 0,
  thumbnail: "",
  display_frame_rate: 30,
};

export const FULL_LUNG_NODULES_REPORT =
  "https://mediclouds-cn.oss-cn-qingdao.aliyuncs.com/%E5%AE%8C%E6%95%B4%E7%89%88%E6%8A%A5%E5%91%8A.jpg"; // 完整版肺结节筛查报告示意图

export const GET_SCORE =
  "https://mediclouds-cn.oss-cn-qingdao.aliyuncs.com/%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E7%A7%AF%E5%88%86_web.jpg"; // 如何获取积分图片
