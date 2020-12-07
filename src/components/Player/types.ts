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

export type PlayerExamIndexT = number; // 检查映射集合 索引
export type PlayerSeriesIndexT = number; // 数据映射集合 索引
export type FrameT = number; // 数据帧
export type WindowIndexT = number; // 窗口映射集合 索引

/**
 * 播放器的序列数据
 * 包含了当前序列的SeriesI基本信息，当前序列的帧数，cs缓存
 */
export interface PlayerSeriesI extends SeriesI {
  cache?: any[]; // 当前序列的缓存
  frame: FrameT; // 当前series在第几帧（图片索引）
  examIndex: number; // 在第几个检查
  seriesIndex: number; // 在第几个序列
  progress: number; // 加载进度 默认为 -1
}

/**
 * 数据映射集合
 */
export type PlayerSeriesMapT = Map<PlayerSeriesIndexT, PlayerSeriesI>;

export interface PlayerExamI {
  index: number; // 检查索引
  examId: string; // 检查id
  patientInfo: PatientExamI; // 病人信息
  playerSeriesMap: PlayerSeriesMapT; // 数据映射集合
  seriesIndex: number; // 当前的数据映射索引 默认0
  active: boolean; // 激活状态 激活的Collection会缓存数据并启用一个Window
}
/**
 * 检查映射集合
 */
export type PlayerExamMapT = Map<PlayerExamIndexT, PlayerExamI>;

/**
 * 窗口结构 渲染相关
 */
export interface WindowI {
  playerSeries?: PlayerSeriesI; // 当前窗口的数据
  frame?: number; // 当前窗口的帧索引，优先级高于数据内的帧索引，当没有或小于0时，使用data内部的frame
  element?: HTMLElement; // 当前窗口的HTML元素
  isActive?: boolean; // 是否被激活
  isPlay?: boolean; // 是否在播放
}

/** 窗口映射集合 */
export type WindowMapT = Map<WindowIndexT, WindowI>;

// ============== actions ================ //
/** 播放器动作 */
export enum PlayerActionE {
  INIT_PLAYER = "init_player", // 初始化播放器
  UPDATE_PLAYER = "update_player", // 更新任意值
  INIT_CORNERSTONE = "init_cornerstone", // 初始化全局cornerstone
  UPDATE_PLAYER_EXAM_MAP = "update_player_exam_map", // 更新检查映射集合
}

/* 窗口动作 */
export enum PlayerWindowsActionE {
  OPEN_WINDOW = "open_window", // 打开窗口
  COLSE_WINDOW = "close_window", // 关闭窗口
  UPDATE_WINDOW = "update_window", // 更新窗口
  ACTIVE_WINDOW = "active_window", // 激活某个窗口
  UPDATE = "update", // 更新整个windows
}
