/* 肺结节筛查 Lung Nodules */

import { PatientExamI } from "./api";

// 筛查报告
export interface LungNoduleReportI extends PatientExamI {
  id: string; // 报告ID
  desc: string; // 报告描述
  flag: 0 | 1 | 2; // 报告状态 0：基础版 1:完整报告 2:带三维重建的完整报告
  exam_id: string; // 关联的exam id
  series_id: string; // 关联的 series id
  nodule_details?: LungNoduleI[]; // 肺结节列表（完整版含）
  volumes?: string[]; // 三维重建体素地址列表（三维重建版含）
  err: 0 | 1; // 此次报告是否有误 0:无错 1: 有错
  thumbnail?: string; // 缩略图
}
// 结节结构
export interface LungNoduleI {
  id: number; // 肺结节ID
  image_details: LungNoduleSliceImgI; // 结节切面图片
  img_z: number; // 图片索引坐标（倒序）
  img_y: number; // y轴坐标
  img_x: number; // x轴坐标
  vol: number; // 结节体积
  tex: 0 | 1 | 2; // 结节材质 0：磨玻璃 1：亚实性 2：实性
  score: number; // 真结节置信度 range: 0 - 1
  disp_z: number; // 图片索引坐标
  rad_frame: number; // 索引前后延伸的图片张数 用于描绘目标框
  rad_pixel: number; // 目标框半径 单位：像素
  max_dim_idx: 0 | 1 | 2; // 最大可观测的维度 0：Z轴 1： Y轴 2：X轴
  long_axis: number; // 结节长轴 mm
  short_axis: number; // 结节短轴 mm
  solid_axis: number; // 结节内实性部分长轴 mm

  // == solid_ratio + cal_ratio + gg_ratio 总和等于1 ==//
  solid_ratio: number; // 结节内实性部分比例
  cal_ratio: number; // 结节内钙化比例
  gg_ratio: number; // 结节内磨玻璃比例

  max_hu: number; // 结节内最大密度
  min_hu: number; // 结节内最小密度
  mean_hu: number; // 结节内平均密度
  std_hu: number; // 结节内密度标准差，表征结节质地混杂程度
  lobe: LobeE; // 所在肺叶
  r_from_top: number; // 肺叶内距顶部比例 range: 0 - 1
  r_from_front: number; // 肺叶内距胸前比例 range: 0 - 1
  r_from_heart: number; // 肺叶内距中心比例 range: 0 - 1
  adj_lobe: LobeE[]; // 临近的肺叶
  description: string; // 位置中文描述
  flag: 0 | 1;
  created_at: string; // 创建日期
  updated_at: string; // 更新日期
  origin_img_url: string; // 原始影像图片url地址
}

// 肺叶枚举
export enum LobeE {
  LU = "lu", // 左肺上叶
  LL = "ll", // 左肺下叶
  RU = "ru", // 右肺上叶
  RM = "rm", // 右肺中叶
  RL = "rl", // 右肺下叶
}

// 肺结节切面图片结构
export interface LungNoduleSliceImgI {
  x_image: string; // X轴未标记图片
  y_image: string; // y轴未标记图片
  z_image: string; // z轴未标记图片
  s_image?: string; // 实性轴未标记图片
  x_image_tag: string; // x轴已标记图片
  y_image_tag: string; // y轴已标记图片
  z_image_tag: string; // z轴未标记图片
  s_image_tag?: string; // 实性轴已标记图片
}

/** AI报告类型 */
export type aiReportType = "lung_nodules" | "others";

/** AI报告action */
export enum AiReportActionE {
  UPDATE_LUNG_NODULE = "update_lung_nodule", // 更新当前的肺结节筛查报告
}

/** AI报告State */
export interface AiReportStateI {
  lungNodule?: LungNoduleReportI;
}

/** AI报告Payload */
export type AiReportPayloadT<T = any> = T;
