import { PatientExamI, SeriesI } from "_types/api";

// ============== Props ================ //
export interface PlayerExamPropsI {
  id: string; // exam id
  defaultSeriesId?: string; // 初始化序列id
  defaultFrame?: number; // 初始化帧索引
  active: boolean; // 是否激活此序列
}

/** 播放器参数 */
export interface PlayerPropsI {
  /** 加载的检查id列表 */
  exams: PlayerExamPropsI[];
  /** 初始化的检查序列索引列表，将在初始化时加载这些检查序列，如果没有，则默认加载第一个（或后面通过setting设定） */
}

// ============== Data ================ //

export type CollectionIndexT = number; // 检查映射集合 索引
export type DataIndexT = number; // 数据映射集合 索引
export type FrameT = number; // 数据帧
export type WindowIndexT = number; // 窗口映射集合 索引

/**
 * 播放器的序列数据
 * 包含了当前序列的SeriesI基本信息，当前序列的帧数，cs缓存
 */
export interface DataI extends SeriesI {
  cache?: any[]; // 当前序列的缓存
  frame: FrameT; // 当前series在第几帧（图片索引）
  examIndex: number; // 在第几个检查
  seriesIndex: number; // 在第几个序列
}

/**
 * 数据映射集合
 */
export type DataMapT = Map<DataIndexT, DataI>;

export interface CollectionI {
  examId: string; // 检查id
  patientInfo: PatientExamI; // 病人信息
  dataMap: DataMapT; // 数据映射集合
  seriesIndex: number; // 当前的数据映射索引 默认0
  active: boolean; // 激活状态 激活的Collection会缓存数据并启用一个Window
}
/**
 * 检查映射集合
 */
export type CollectionMapT = Map<CollectionIndexT, CollectionI>;

/**
 * 窗口结构 渲染相关
 */
export interface WindowI {
  data?: DataI; // 当前窗口的数据
  frame?: number; // 当前窗口的帧索引，优先级高于数据内的帧索引，当没有或小于0时，使用data内部的frame
  element?: HTMLElement; // 当前窗口的HTML元素
  active?: boolean; // 是否被激活
}

/** 窗口映射集合 */
export type WindowMapT = Map<WindowIndexT, WindowI>;

// ============== actions ================ //
/** 播放器动作 */
export enum PlayerActionE {
  INIT_CS = "init_cs", // 全局cornerstone
  INIT_CST = "init_cst", // 全局cornerstone tools
  INIT_CS_IMGLOADER = "init_cs_imgloader", // 全局 cornerstone WADO Imageloader
  UPDATE_COLLECTION_MAP = "update_collection_map", // 更新检查映射集合
}

/* 窗口动作 */
export enum PlayerWindowsActionE {
  OPEN_WINDOW = "open_window", // 打开窗口
  COLSE_WINDOW = "close_window", // 关闭窗口
  UPDATE_WINDOW = "update_window", // 更新窗口
  ACTIVE_WINDOW = "active_window", // 激活某个窗口
  UPDATE = "update", // 更新整个windows
}
