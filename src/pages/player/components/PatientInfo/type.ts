import { LungNoduleI, LungNoduleReportI } from "_types/ai";
import { PatientExamI, SeriesI, SeriesBasicI } from "_types/api";

export interface PatientInfoPropsI {
  patientInfo: PatientExamI; // 病人检查信息
  show: boolean; // 是否显示
  currentSeries?: SeriesBasicI; // 当前的序列
  seriesIndex: number; // 序列索引
  imageIndex: number; // 图片索引
  imageIndexMax: number; // 图片索引最大值
  nodule?: LungNoduleI; // 当前选择的结节
}
