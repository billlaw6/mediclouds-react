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
