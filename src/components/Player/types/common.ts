export interface PlayerExamPropsI {
  id: string; // exam id
  defaultSeriesId?: string; // 初始化序列id
  defaultFrame?: number; // 初始化帧索引
  active: boolean; // 是否激活此序列
  defaultLungNodule?: boolean; // 是否初始化显示肺结节筛查
}

export interface PlayerPropsI {
  exams: PlayerExamPropsI[];
  backTo?: string; // 顶部返回键对应的返回地址
}

export type CstToolNameT = "Wwwc" | "Length" | "Pan" | "Zoom" | "DragProbe" | "";
